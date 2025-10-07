'use client';

import React, { useState, useEffect } from 'react';
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
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  // 매초마다 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (endTime: number) => {
    const remaining = Math.max(0, endTime - currentTime);
    
    // 콘솔에 남은 시간 정보 출력
    console.log('Battle Time Info:', {
      endTime,
      currentTime,
      remaining,
      remainingFormatted: {
        days: Math.floor(remaining / 86400),
        hours: Math.floor((remaining % 86400) / 3600),
        minutes: Math.floor((remaining % 3600) / 60),
        seconds: remaining % 60
      },
      battleId,
      isActive,
      isSettled
    });
    
    if (remaining === 0) return 'Battle Ended';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
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
    ,  // createTime (unused)
    endTime,
    ,  // activationTime (unused)
    state,
    isSettled,
    winner,
    ethPool,
    btcPool
  ] = battle;

  const isActive = Number(state) === 1; // state === 1 (Active)
  const isEnded = Number(state) === 2; // state === 2 (Ended)

  const ethBettingPool = Number(formatMonAmount(ethPool));
  const btcBettingPool = Number(formatMonAmount(btcPool));
  const totalPool = ethBettingPool + btcBettingPool;
  const ethOdds = totalPool > 0 ? (ethBettingPool / totalPool * 100) : 50;
  const btcOdds = totalPool > 0 ? (btcBettingPool / totalPool * 100) : 50;
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="text-center">
        <div className="flex justify-between items-center mb-4">
          <Badge variant={isActive ? "error" : isEnded ? "success" : "warning"} size="md">
            {isActive ? "🔴 LIVE BATTLE" : isEnded ? "✅ BATTLE ENDED" : "🟡 BATTLE STARTING"}
          </Badge>
          <div className="text-sm text-[#B8BFC6]">Battle #{String(battleId).padStart(3, '0')}</div>
          <Badge variant={isActive ? "error" : isEnded ? "success" : "info"} size="md" className="min-w-[140px] text-center">
            {isActive ? (
              <span className="font-mono">
                ⏰ {formatTime(Number(endTime))}
              </span>
            ) : isEnded ? (
              "✅ Settled"
            ) : (
              "🔜 Starting Soon"
            )}
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
            isInBattle={isActive || isEnded}
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
              {isActive && Number(endTime) > currentTime && (
                <div className="mt-3">
                  <div className="w-full bg-[#2A3238] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F87171] to-[#5AD8CC] transition-all duration-1000"
                      style={{ 
                        width: `${Math.max(0, Math.min(100, ((Number(endTime) - currentTime) / 3600) * 100))}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#8B9299] mt-1">Time Remaining</p>
                </div>
              )}
              {(isEnded || isSettled) && (
                <div className="mt-3 bg-gradient-to-r from-[#4ADE80]/20 to-[#5AD8CC]/20 rounded-lg p-3 border border-[#4ADE80]/30">
                  <p className="text-xs text-[#8B9299] mb-1">Winner</p>
                  <p className="text-xl font-bold text-[#4ADE80]">
                    {winner === 0 ? '🦄 ETH Monster' : '🦁 BTC Monster'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Monster
            monsterId={Number(btcMonsterId)}
            battleId={battleId}
            isInBattle={isActive || isEnded}
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