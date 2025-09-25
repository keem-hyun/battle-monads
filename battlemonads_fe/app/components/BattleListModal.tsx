'use client';

import React from 'react';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';
import { useBattleMonads } from '../hooks/useBattleMonads';

interface Battle {
  battleId: number;
  monster1: number;
  monster2: number;
  pool1: bigint;
  pool2: bigint;
  isActive: boolean;
  winner?: number;
  endTime?: bigint;
}

interface BattleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBattle: (battleId: number) => void;
  currentBattleId?: number;
}

export function BattleListModal({ isOpen, onClose, onSelectBattle, currentBattleId }: BattleListModalProps) {
  const { formatMonAmount } = useBattleMonads();

  // 임시 데이터 (나중에 실제 배틀 목록 조회로 대체)
  const battles: Battle[] = [
    {
      battleId: 1,
      monster1: 1,
      monster2: 2,
      pool1: BigInt('1000000000000000000'), // 1 ETH
      pool2: BigInt('1500000000000000000'), // 1.5 ETH
      isActive: true
    },
    {
      battleId: 2,
      monster1: 3,
      monster2: 4,
      pool1: BigInt('2000000000000000000'), // 2 ETH
      pool2: BigInt('1800000000000000000'), // 1.8 ETH
      isActive: false,
      winner: 3,
      endTime: BigInt(Date.now() / 1000 - 3600) // 1시간 전 종료
    },
    {
      battleId: 3,
      monster1: 5,
      monster2: 6,
      pool1: BigInt('500000000000000000'), // 0.5 ETH
      pool2: BigInt('750000000000000000'), // 0.75 ETH
      isActive: true
    }
  ];

  const activeBattles = battles.filter(battle => battle.isActive);
  const completedBattles = battles.filter(battle => !battle.isActive);

  const handleSelectBattle = (battleId: number) => {
    onSelectBattle(battleId);
    onClose();
  };

  const formatTimeAgo = (endTime?: bigint) => {
    if (!endTime) return '';
    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(endTime);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Battle List">
      <div className="space-y-6">
        {/* Active Battles */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            🔥 Active Battles ({activeBattles.length})
          </h3>
          <div className="space-y-3">
            {activeBattles.length > 0 ? (
              activeBattles.map((battle) => (
                <Card
                  key={battle.battleId}
                  className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    currentBattleId === battle.battleId
                      ? 'bg-gradient-to-r from-[#5AD8CC]/20 to-[#4ADE80]/20 border-[#5AD8CC]'
                      : 'hover:bg-[#1e2429]'
                  }`}
                  onClick={() => handleSelectBattle(battle.battleId)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">Battle #{battle.battleId}</span>
                        {currentBattleId === battle.battleId && (
                          <span className="bg-[#5AD8CC] text-black text-xs px-2 py-1 rounded-full font-bold">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#8B9299]">
                        Monster #{battle.monster1} vs Monster #{battle.monster2}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        {formatMonAmount(battle.pool1 + battle.pool2)} MON
                      </div>
                      <div className="text-xs text-[#8B9299]">Total Pool</div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8">
                <div className="text-4xl mb-2">😴</div>
                <p className="text-[#8B9299]">No active battles</p>
              </Card>
            )}
          </div>
        </div>

        {/* Completed Battles */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            ✅ Completed Battles ({completedBattles.length})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {completedBattles.length > 0 ? (
              completedBattles.map((battle) => (
                <Card
                  key={battle.battleId}
                  className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-[#1e2429] opacity-75"
                  onClick={() => handleSelectBattle(battle.battleId)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">Battle #{battle.battleId}</span>
                        <span className="bg-[#8B9299] text-white text-xs px-2 py-1 rounded-full">
                          FINISHED
                        </span>
                      </div>
                      <div className="text-sm text-[#8B9299]">
                        Monster #{battle.monster1} vs Monster #{battle.monster2}
                        {battle.winner && (
                          <span className="ml-2 text-[#4ADE80]">
                            • Winner: #{battle.winner}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        {formatMonAmount(battle.pool1 + battle.pool2)} MON
                      </div>
                      <div className="text-xs text-[#8B9299]">
                        {formatTimeAgo(battle.endTime)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8">
                <div className="text-4xl mb-2">📜</div>
                <p className="text-[#8B9299]">No completed battles</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}