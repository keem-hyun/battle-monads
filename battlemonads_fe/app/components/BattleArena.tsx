'use client';

import React from 'react';
import { Monster } from './Monster';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface BattleArenaProps {
  battleId: string;
  ethMonster: {
    id: string;
    currentHP: number;
    maxHP: number;
    birthPrice: number;
    currentPrice: number;
    owner: string;
  };
  btcMonster: {
    id: string;
    currentHP: number;
    maxHP: number;
    birthPrice: number;
    currentPrice: number;
    owner: string;
  };
  ethBettingPool: number;
  btcBettingPool: number;
  timeRemaining: number;
  weatherBonus?: {
    type: 'SUNNY' | 'RAINY' | 'CLOUDY' | 'SNOWY';
    ethBonus: number;
    btcBonus: number;
  };
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  battleId,
  ethMonster,
  btcMonster,
  ethBettingPool,
  btcBettingPool,
  timeRemaining,
  weatherBonus,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  const totalPool = ethBettingPool + btcBettingPool;
  const ethOdds = totalPool > 0 ? (btcBettingPool / totalPool * 100) : 50;
  const btcOdds = totalPool > 0 ? (ethBettingPool / totalPool * 100) : 50;
  
  const weatherEmoji = {
    'SUNNY': '☀️',
    'RAINY': '🌧️',
    'CLOUDY': '☁️',
    'SNOWY': '❄️',
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="text-center">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="error" size="md">LIVE BATTLE</Badge>
          <div className="text-sm text-[#B8BFC6]">Battle #{battleId.slice(0, 8)}</div>
          <Badge variant="info" size="md">{formatTime(timeRemaining)} remaining</Badge>
        </div>
        
        {weatherBonus && (
          <div className="bg-[#121619] rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{weatherEmoji[weatherBonus.type]}</span>
              <div>
                <p className="text-sm text-[#8B9299]">Weather Bonus</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#627EEA]">ETH: +{weatherBonus.ethBonus} HP/min</span>
                  <span className="text-[#F7931A]">BTC: +{weatherBonus.btcBonus} HP/min</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-white mb-2">⚔️ BATTLE ARENA ⚔️</h2>
        <p className="text-[#8B9299]">ETH Monster vs BTC Monster</p>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Monster
            id={ethMonster.id}
            type="ETH"
            currentHP={ethMonster.currentHP}
            maxHP={ethMonster.maxHP}
            birthPrice={ethMonster.birthPrice}
            currentPrice={ethMonster.currentPrice}
            owner={ethMonster.owner}
            isInBattle
          />
          <Card className="bg-[#627EEA]/10 border-[#627EEA]/30">
            <div className="text-center">
              <p className="text-xs text-[#8B9299] mb-1">Betting Pool</p>
              <p className="text-2xl font-bold text-[#627EEA]">
                {ethBettingPool.toLocaleString()} MON
              </p>
              <p className="text-sm text-[#8B9299] mt-1">
                Win Odds: {ethOdds.toFixed(1)}%
              </p>
            </div>
          </Card>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⚡</div>
            <div className="text-4xl font-bold text-[#5AD8CC] mb-2">VS</div>
            <div className="bg-[#1e2429] rounded-lg p-4">
              <p className="text-xs text-[#8B9299] mb-2">Total Pool</p>
              <p className="text-2xl font-bold text-[#5AD8CC]">
                {totalPool.toLocaleString()} MON
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Monster
            id={btcMonster.id}
            type="BTC"
            currentHP={btcMonster.currentHP}
            maxHP={btcMonster.maxHP}
            birthPrice={btcMonster.birthPrice}
            currentPrice={btcMonster.currentPrice}
            owner={btcMonster.owner}
            isInBattle
          />
          <Card className="bg-[#F7931A]/10 border-[#F7931A]/30">
            <div className="text-center">
              <p className="text-xs text-[#8B9299] mb-1">Betting Pool</p>
              <p className="text-2xl font-bold text-[#F7931A]">
                {btcBettingPool.toLocaleString()} MON
              </p>
              <p className="text-sm text-[#8B9299] mt-1">
                Win Odds: {btcOdds.toFixed(1)}%
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};