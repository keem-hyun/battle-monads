'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { createPublicClient, http, fallback } from 'viem';
import { sepolia } from 'viem/chains';
import { PRICE_FEEDS_ABI, PRICE_FEEDS_ADDRESS } from '../lib/contracts/PriceFeeds';

export interface PriceData {
  symbol: 'ETH' | 'BTC';
  price: number;
  timestamp: number;
  change24h: number;
  change24hPercent: number;
}

interface PriceHistory {
  price: number;
  timestamp: number;
}

// Sepolia Chainlink Data Feed addresses (from README.md - verified and working)
const SEPOLIA_CHAINLINK_ADDRESSES = {
  ETH_USD: '0x694AA1769357215DE4FAC081bf1f309aDC325306' as const, // 8 decimals
  BTC_USD: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43' as const, // 8 decimals
};

// Global cache to prevent multiple API calls from different component instances
let lastFetchTime = 0;
let cachedPrices: PriceData[] = [];
const CACHE_DURATION = 2000; // 2 seconds cache

export const usePriceFeeds = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<Map<string, PriceHistory[]>>(new Map());
  const publicClient = usePublicClient();
  const priceHistoryRef = useRef<Map<string, PriceHistory[]>>(new Map());

  // Create separate client for Sepolia with multiple fallback RPC endpoints
  const sepoliaClient = createPublicClient({
    chain: sepolia,
    transport: fallback([
      http('https://ethereum-sepolia-rpc.publicnode.com'),
      http('https://rpc.sepolia.org'),
      http('https://eth-sepolia-public.unifra.io'),
      http('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'), // Public Infura
    ]),
  });

  // Update ref whenever priceHistory changes
  useEffect(() => {
    priceHistoryRef.current = priceHistory;
  }, [priceHistory]);

  const calculatePriceChange = useCallback((symbol: string, currentPrice: number, currentTimestamp: number) => {
    const history = priceHistoryRef.current.get(symbol) || [];

    // 24시간 전 가격 찾기 (가장 가까운 값)
    const oneDayAgo = currentTimestamp - (24 * 60 * 60 * 1000);
    const closest24hPrice = history.find(h => Math.abs(h.timestamp - oneDayAgo) < (2 * 60 * 60 * 1000)) // 2시간 오차 허용
      || history[0]; // 없으면 가장 오래된 가격 사용

    if (!closest24hPrice) {
      return { change24h: 0, change24hPercent: 0 };
    }

    const change24h = currentPrice - closest24hPrice.price;
    const change24hPercent = (change24h / closest24hPrice.price) * 100;

    return { change24h, change24hPercent };
  }, []); // Empty dependencies to prevent infinite loop

  const updatePriceHistory = useCallback((symbol: string, price: number, timestamp: number) => {
    setPriceHistory(prev => {
      const newHistory = new Map(prev);
      const history = newHistory.get(symbol) || [];

      // 새 가격 추가
      history.push({ price, timestamp });

      // 24시간 이상 된 데이터 정리 (25시간으로 여유 두기)
      const cutoff = timestamp - (25 * 60 * 60 * 1000);
      const filteredHistory = history.filter(h => h.timestamp > cutoff);

      // 최대 288개 엔트리 유지 (5분 간격 * 24시간)
      if (filteredHistory.length > 288) {
        filteredHistory.splice(0, filteredHistory.length - 288);
      }

      newHistory.set(symbol, filteredHistory);
      return newHistory;
    });
  }, []);

  const fetchPriceFromAPI = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (now - lastFetchTime < CACHE_DURATION && cachedPrices.length > 0) {
      console.log('Using cached prices');
      setPrices([...cachedPrices]);
      return;
    }

    try {
      console.log('Fetching fresh prices from server API...');
      const response = await fetch('/api/prices', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server API returned ${response.status}`);
      }

      const result = await response.json();
      console.log('Server API Response:', result);

      if (result.success) {
        const { ethPrice, btcPrice, ethChange, btcChange } = result.data;
        const currentTimestamp = Date.now();

        updatePriceHistory('ETH', ethPrice, currentTimestamp);
        updatePriceHistory('BTC', btcPrice, currentTimestamp);

        const ethPriceChange = calculatePriceChange('ETH', ethPrice, currentTimestamp);
        const btcPriceChange = calculatePriceChange('BTC', btcPrice, currentTimestamp);

        const newPrices = [
          {
            symbol: 'ETH' as const,
            price: ethPrice,
            timestamp: currentTimestamp,
            change24h: ethPriceChange.change24h || ethChange,
            change24hPercent: ethPriceChange.change24hPercent || ethChange,
          },
          {
            symbol: 'BTC' as const,
            price: btcPrice,
            timestamp: currentTimestamp,
            change24h: btcPriceChange.change24h || btcChange,
            change24hPercent: btcPriceChange.change24hPercent || btcChange,
          },
        ];

        // Update cache
        lastFetchTime = now;
        cachedPrices = [...newPrices];
        setPrices(newPrices);

        console.log(`✅ Successfully fetched prices from server (${result.source}):`, { ethPrice, btcPrice, ethChange, btcChange });
        return;
      } else {
        throw new Error(`Server API failed: ${result.error}`);
      }
    } catch (error) {
      console.warn('Server API failed:', error);

      // Fallback to mock data if server API fails
      const currentTimestamp = Date.now();
      const mockEthPrice = 3500;
      const mockBtcPrice = 95000;

      updatePriceHistory('ETH', mockEthPrice, currentTimestamp);
      updatePriceHistory('BTC', mockBtcPrice, currentTimestamp);

      const ethPriceChange = calculatePriceChange('ETH', mockEthPrice, currentTimestamp);
      const btcPriceChange = calculatePriceChange('BTC', mockBtcPrice, currentTimestamp);

      const fallbackPrices = [
        {
          symbol: 'ETH' as const,
          price: mockEthPrice,
          timestamp: currentTimestamp,
          change24h: ethPriceChange.change24h || 0,
          change24hPercent: ethPriceChange.change24hPercent || 0,
        },
        {
          symbol: 'BTC' as const,
          price: mockBtcPrice,
          timestamp: currentTimestamp,
          change24h: btcPriceChange.change24h || 0,
          change24hPercent: btcPriceChange.change24hPercent || 0,
        },
      ];

      setPrices(fallbackPrices);
      console.log('⚠️ Using fallback data due to server API failure');
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);

      // DUAL NETWORK SETUP with fallbacks:
      // 1. Try Sepolia Chainlink feeds (most reliable for DeFi)
      // 2. Fallback to CoinGecko API (reliable price API)
      // - Game Logic: Monad contracts (your BattleMonads contracts remain on Monad)
      const [ethPriceResult, btcPriceResult] = await Promise.all([
        sepoliaClient.readContract({
          address: SEPOLIA_CHAINLINK_ADDRESSES.ETH_USD,
          abi: [{
            "inputs": [],
            "name": "latestRoundData",
            "outputs": [
              { "internalType": "uint80", "name": "roundId", "type": "uint80" },
              { "internalType": "int256", "name": "answer", "type": "int256" },
              { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
              { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
              { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
            ],
            "stateMutability": "view",
            "type": "function"
          }],
          functionName: 'latestRoundData',
        }),
        sepoliaClient.readContract({
          address: SEPOLIA_CHAINLINK_ADDRESSES.BTC_USD,
          abi: [{
            "inputs": [],
            "name": "latestRoundData",
            "outputs": [
              { "internalType": "uint80", "name": "roundId", "type": "uint80" },
              { "internalType": "int256", "name": "answer", "type": "int256" },
              { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
              { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
              { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
            ],
            "stateMutability": "view",
            "type": "function"
          }],
          functionName: 'latestRoundData',
        }),
      ]);

      // Extract price and timestamp from Sepolia Chainlink feeds
      const [, ethPrice, , ethTimestamp] = ethPriceResult as [bigint, bigint, bigint, bigint, bigint];
      const [, btcPrice, , btcTimestamp] = btcPriceResult as [bigint, bigint, bigint, bigint, bigint];

      // Chainlink 가격은 8 decimals를 사용
      const ethPriceFormatted = Number(ethPrice) / 1e8;
      const btcPriceFormatted = Number(btcPrice) / 1e8;
      const currentTimestamp = Date.now();

      // 가격 히스토리 업데이트
      updatePriceHistory('ETH', ethPriceFormatted, currentTimestamp);
      updatePriceHistory('BTC', btcPriceFormatted, currentTimestamp);

      // 실제 24시간 변화량 계산
      const ethChange = calculatePriceChange('ETH', ethPriceFormatted, currentTimestamp);
      const btcChange = calculatePriceChange('BTC', btcPriceFormatted, currentTimestamp);

      setPrices([
        {
          symbol: 'ETH',
          price: ethPriceFormatted,
          timestamp: Number(ethTimestamp) * 1000,
          change24h: ethChange.change24h,
          change24hPercent: ethChange.change24hPercent,
        },
        {
          symbol: 'BTC',
          price: btcPriceFormatted,
          timestamp: Number(btcTimestamp) * 1000,
          change24h: btcChange.change24h,
          change24hPercent: btcChange.change24hPercent,
        },
      ]);

      setError(null);
      console.log('✅ Fetched real prices from Sepolia Chainlink feeds');
    } catch (chainlinkError) {
      console.warn('Sepolia Chainlink feeds failed, trying CoinGecko...', chainlinkError);

      try {
        await fetchPriceFromAPI();
        setError(null);
      } catch (coinGeckoError) {
        console.error('Both Chainlink and CoinGecko failed:', coinGeckoError);
        setError('Failed to fetch prices from all sources');

        // 최후 수단으로 mock 데이터 사용
        const mockTimestamp = Date.now();
        const mockEthPrice = 2520;
        const mockBtcPrice = 65500;

        updatePriceHistory('ETH', mockEthPrice, mockTimestamp);
        updatePriceHistory('BTC', mockBtcPrice, mockTimestamp);

        const ethChange = calculatePriceChange('ETH', mockEthPrice, mockTimestamp);
        const btcChange = calculatePriceChange('BTC', mockBtcPrice, mockTimestamp);

        setPrices([
          {
            symbol: 'ETH',
            price: mockEthPrice,
            timestamp: mockTimestamp,
            change24h: ethChange.change24h,
            change24hPercent: ethChange.change24hPercent,
          },
          {
            symbol: 'BTC',
            price: mockBtcPrice,
            timestamp: mockTimestamp,
            change24h: btcChange.change24h,
            change24hPercent: btcChange.change24hPercent,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies to prevent infinite loop

  useEffect(() => {
    // Create stable reference to fetchPrices to avoid recreation
    const fetchPricesStable = () => {
      fetchPrices();
    };

    fetchPricesStable();

    // Update every 3 seconds for real-time experience
    const updateInterval = 3000; // 3 seconds
    const interval = setInterval(fetchPricesStable, updateInterval);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent infinite loop

  // 가격 히스토리 로컬 스토리지 저장/로드
  useEffect(() => {
    const savedHistory = localStorage.getItem('priceHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const historyMap = new Map();
        Object.entries(parsed).forEach(([symbol, history]) => {
          historyMap.set(symbol, history as PriceHistory[]);
        });
        setPriceHistory(historyMap);
      } catch (e) {
        console.error('Failed to load price history from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    // 가격 히스토리를 로컬 스토리지에 저장
    const historyObject: Record<string, PriceHistory[]> = {};
    priceHistory.forEach((history, symbol) => {
      historyObject[symbol] = history;
    });
    localStorage.setItem('priceHistory', JSON.stringify(historyObject));
  }, [priceHistory]);

  return {
    prices,
    loading,
    error,
    refetch: fetchPrices,
    priceHistory: priceHistory,
    lastUpdate: prices[0]?.timestamp || Date.now()
  };
};