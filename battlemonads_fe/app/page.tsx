'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePriceFeeds } from './hooks/usePriceFeeds';
import { Header } from './components/Header';
import { BattleArena } from './components/BattleArena';
import { BettingPanel } from './components/BettingPanel';
import { PriceTicker } from './components/PriceTicker';
import { Monster } from './components/Monster';
import { CommentSection } from './components/CommentSection';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';

export default function Home() {
  const { address } = useAccount();
  const { prices, loading: pricesLoading } = usePriceFeeds();
  const [userBalance, setUserBalance] = useState(10000);
  const [activeBattle, setActiveBattle] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [userMonsters, setUserMonsters] = useState([
    {
      id: '0x123456',
      type: 'ETH' as const,
      currentHP: 85,
      maxHP: 100,
      birthPrice: 2400,
      currentPrice: prices.find(p => p.symbol === 'ETH')?.price || 2520,
      owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    },
    {
      id: '0x789abc',
      type: 'BTC' as const,
      currentHP: 92,
      maxHP: 100,
      birthPrice: 64000,
      currentPrice: prices.find(p => p.symbol === 'BTC')?.price || 65500,
      owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    },
  ]);
  
  const mockBattleData = {
    battleId: '0xbattle123',
    ethMonster: {
      id: '0xeth456',
      currentHP: 75,
      maxHP: 100,
      birthPrice: 2450,
      currentPrice: prices.find(p => p.symbol === 'ETH')?.price || 2520,
      owner: '0x123...abc',
    },
    btcMonster: {
      id: '0xbtc789',
      currentHP: 82,
      maxHP: 100,
      birthPrice: 65000,
      currentPrice: prices.find(p => p.symbol === 'BTC')?.price || 65500,
      owner: '0x456...def',
    },
    ethBettingPool: 5000,
    btcBettingPool: 3500,
    timeRemaining: 14400,
    weatherBonus: {
      type: 'RAINY' as const,
      ethBonus: 10,
      btcBonus: 3,
    },
  };
  
  // 실제 가격 데이터 사용
  const priceData = prices;
  
  const [userBets, setUserBets] = useState({
    eth: 0,
    btc: 0,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // 가격 데이터가 업데이트될 때마다 몬스터 현재 가격 업데이트
  useEffect(() => {
    if (prices.length > 0) {
      setUserMonsters(prev => prev.map(monster => ({
        ...monster,
        currentPrice: prices.find(p => p.symbol === monster.type)?.price || monster.currentPrice,
      })));
    }
  }, [prices]);
  
  const handlePlaceBet = (type: 'ETH' | 'BTC', amount: number) => {
    if (amount <= userBalance) {
      setUserBalance(prev => prev - amount);
      setUserBets(prev => ({
        ...prev,
        [type.toLowerCase()]: prev[type.toLowerCase() as 'eth' | 'btc'] + amount,
      }));
    }
  };
  
  const handleAttack = (target: 'ETH' | 'BTC') => {
    console.log(`Attacking ${target} monster!`);
  };
  
  const handleCreateMonster = (type: 'ETH' | 'BTC') => {
    console.log(`Creating ${type} monster...`);
  };
  
  const handleSubmitComment = (message: string, type: 'comment' | 'attack', target?: 'ETH' | 'BTC') => {
    console.log('Comment submitted:', { message, type, target });
    // In a real app, this would send the comment to the blockchain or backend
    if (type === 'attack' && target) {
      console.log(`Attacking ${target} monster with message: ${message}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#121619]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              ⚔️ Battle Monads ⚔️
            </h2>
            <p className="text-[#8B9299]">
              Real-time price-based monster battles powered by Chainlink Data Feeds on Monad
            </p>
          </div>
          
          {activeBattle ? (
            <>
              <BattleArena {...mockBattleData} />
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PriceTicker prices={priceData} lastUpdate={lastUpdate} />
                </div>
                <div>
                  <BettingPanel
                    battleId={mockBattleData.battleId}
                    userBalance={userBalance}
                    userBets={userBets}
                    onPlaceBet={handlePlaceBet}
                    onAttack={handleAttack}
                    canAttack={userBets.eth > 0 || userBets.btc > 0}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Active Battle</h3>
                <p className="text-[#8B9299] mb-6">
                  Create or wait for monsters to start battling!
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => handleCreateMonster('ETH')} variant="secondary">
                    🦄 Create ETH Monster
                  </Button>
                  <Button onClick={() => handleCreateMonster('BTC')} variant="secondary">
                    🦁 Create BTC Monster
                  </Button>
                </div>
              </Card>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Your Monsters</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userMonsters.map((monster) => (
                    <Monster
                      key={monster.id}
                      {...monster}
                    />
                  ))}
                </div>
              </div>
              
              <PriceTicker prices={priceData} lastUpdate={lastUpdate} />
            </div>
          )}
          
          <CommentSection
            battleId={activeBattle ? mockBattleData.battleId : undefined}
            onSubmitComment={handleSubmitComment}
            userAddress={address}
          />
          
          <Card className="bg-gradient-to-r from-[#1e2429] to-[#232a30]">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Game Stats</h3>
                <p className="text-sm text-[#8B9299]">Powered by Monad & Chainlink</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#5AD8CC]">24</p>
                  <p className="text-xs text-[#8B9299]">Active Battles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#5AD8CC]">156</p>
                  <p className="text-xs text-[#8B9299]">Total Monsters</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#5AD8CC]">89.5K</p>
                  <p className="text-xs text-[#8B9299]">MON Volume</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
