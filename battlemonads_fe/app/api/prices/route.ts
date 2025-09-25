import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🚀 Price API route called at:', new Date().toISOString());

  // Try multiple API sources in order of reliability (Binance first as it's most reliable)
  const apiSources = [
    {
      name: 'Binance',
      url: 'https://api.binance.com/api/v3/ticker/24hr?symbols=["ETHUSDT","BTCUSDT"]',
      parser: (data: any) => {
        const eth = data.find((ticker: any) => ticker.symbol === 'ETHUSDT');
        const btc = data.find((ticker: any) => ticker.symbol === 'BTCUSDT');
        return {
          ethPrice: parseFloat(eth?.lastPrice || '3500'),
          btcPrice: parseFloat(btc?.lastPrice || '95000'),
          ethChange: parseFloat(eth?.priceChangePercent || '0'),
          btcChange: parseFloat(btc?.priceChangePercent || '0'),
        };
      }
    },
    {
      name: 'CoinGecko',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      parser: (data: any) => ({
        ethPrice: data.ethereum.usd,
        btcPrice: data.bitcoin.usd,
        ethChange: data.ethereum.usd_24h_change || 0,
        btcChange: data.bitcoin.usd_24h_change || 0,
      })
    },
    {
      name: 'CoinCap',
      url: 'https://api.coincap.io/v2/assets?ids=bitcoin,ethereum',
      parser: (data: any) => {
        const btc = data.data.find((asset: any) => asset.id === 'bitcoin');
        const eth = data.data.find((asset: any) => asset.id === 'ethereum');
        return {
          ethPrice: parseFloat(eth?.priceUsd || '3500'),
          btcPrice: parseFloat(btc?.priceUsd || '95000'),
          ethChange: parseFloat(eth?.changePercent24Hr || '0'),
          btcChange: parseFloat(btc?.changePercent24Hr || '0'),
        };
      }
    }
  ];

  for (const source of apiSources) {
    try {
      console.log(`Trying ${source.name} API...`);
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'BattleMonads/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${source.name} API returned ${response.status}`);
      }

      const data = await response.json();
      const { ethPrice, btcPrice, ethChange, btcChange } = source.parser(data);

      console.log(`✅ Successfully fetched prices from ${source.name}:`, { ethPrice, btcPrice, ethChange, btcChange });
      return NextResponse.json({
        success: true,
        source: source.name,
        data: {
          ethPrice,
          btcPrice,
          ethChange,
          btcChange,
        }
      });
    } catch (error) {
      console.warn(`${source.name} failed:`, error);
      continue;
    }
  }

  // If all APIs fail, return error
  return NextResponse.json(
    {
      success: false,
      error: 'All price API sources failed',
      fallback: {
        ethPrice: 3500,
        btcPrice: 95000,
        ethChange: 0,
        btcChange: 0,
      }
    },
    { status: 500 }
  );
}