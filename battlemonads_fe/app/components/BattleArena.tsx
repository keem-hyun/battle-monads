'use client';

import React from 'react';
import { Monster } from './Monster';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { useBattleMonads } from '../hooks/useBattleMonads';

interface BattleArenaProps {
  battleId: number;
}

export const BattleArena: React.FC<BattleArenaProps> = ({ battleId }) => {
  const { useBattle, formatMonAmount } = useBattleMonads();
  const { data: battle, isLoading } = useBattle(battleId);

  const formatTime = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Math.max(0, endTime - now);
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading || !battle) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card className="animate-pulse">
          <div className="h-64 bg-[#121619] rounded-lg"></div>
        </Card>
      </div>
    );
  }

  const [
    ,  // id (unused)
    ethMonsterId,
    btcMonsterId,
    ,  // startTime (unused)
    endTime,
    isActive,
    isSettled,
    winner,
    ethPool,
    btcPool
  ] = battle;

  const ethBettingPool = Number(formatMonAmount(ethPool));
  const btcBettingPool = Number(formatMonAmount(btcPool));
  const totalPool = ethBettingPool + btcBettingPool;
  const ethOdds = totalPool > 0 ? (btcBettingPool / totalPool * 100) : 50;
  const btcOdds = totalPool > 0 ? (ethBettingPool / totalPool * 100) : 50;
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="text-center">
        <div className="flex justify-between items-center mb-4">
          <Badge variant={isActive ? "error" : "warning"} size="md">
            {isActive ? "LIVE BATTLE" : isSettled ? "BATTLE ENDED" : "BATTLE STARTING"}
          </Badge>
          <div className="text-sm text-[#B8BFC6]">Battle #{String(battleId).padStart(3, '0')}</div>
          <Badge variant="info" size="md">
            {isActive ? `${formatTime(Number(endTime))} remaining` : 
             isSettled ? "Settled" : "Starting Soon"}
          </Badge>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">⚔️ BATTLE ARENA ⚔️</h2>
        <p className="text-[#8B9299]">ETH Monster vs BTC Monster</p>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Monster
            monsterId={Number(ethMonsterId)}
            battleId={battleId}
            isInBattle={isActive}
          />
          <Card className="bg-[#627EEA]/10 border-[#627EEA]/30">
            <div className="text-center">
              <p className="text-xs text-[#8B9299] mb-1">ETH Betting Pool</p>
              <p className="text-2xl font-bold text-[#627EEA]">
                {ethBettingPool.toFixed(4)} MON
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
                {totalPool.toFixed(4)} MON
              </p>
              {isSettled && (
                <p className="text-sm text-[#5AD8CC] mt-2">
                  Winner: {winner === 0 ? 'ETH 🦄' : 'BTC 🦁'}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Monster
            monsterId={Number(btcMonsterId)}
            battleId={battleId}
            isInBattle={isActive}
          />
          <Card className="bg-[#F7931A]/10 border-[#F7931A]/30">
            <div className="text-center">
              <p className="text-xs text-[#8B9299] mb-1">BTC Betting Pool</p>
              <p className="text-2xl font-bold text-[#F7931A]">
                {btcBettingPool.toFixed(4)} MON
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