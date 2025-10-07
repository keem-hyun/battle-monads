'use client';

import React from 'react';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';
import { useBattleMonads } from '../hooks/useBattleMonads';

interface Battle {
  battleId: number;
  ethMonsterId: number;
  btcMonsterId: number;
  ethPool: bigint;
  btcPool: bigint;
  state: number; // 0: Pending, 1: Active, 2: Ended
  isSettled: boolean;
  winner?: number;
  createTime: bigint;
  endTime: bigint;
}

interface BattleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBattle: (battleId: number) => void;
  currentBattleId?: number;
}

export function BattleListModal({ isOpen, onClose, onSelectBattle, currentBattleId }: BattleListModalProps) {
  const { formatMonAmount, useBattleCount, useActiveAndEndedBattles } = useBattleMonads();
  const [currentTime, setCurrentTime] = React.useState(Math.floor(Date.now() / 1000));

  // 매초마다 시간 업데이트
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 실제 컨트랙트 데이터 조회 - Active와 Ended 배틀만
  const { data: battleCount } = useBattleCount();
  const { data: battlesData, isLoading } = useActiveAndEndedBattles(100);

  // 데이터 변환
  const battles: Battle[] = React.useMemo(() => {
    if (!battlesData) return [];

    const [
      battleIds,
      ethMonsterIds,
      btcMonsterIds,
      createTimes,
      endTimes,
      states,
      isSettledList,
      winners,
      ethPools,
      btcPools
    ] = battlesData;

    return battleIds.map((battleId, index) => ({
      battleId: Number(battleId),
      ethMonsterId: Number(ethMonsterIds[index]),
      btcMonsterId: Number(btcMonsterIds[index]),
      ethPool: ethPools[index],
      btcPool: btcPools[index],
      state: Number(states[index]),
      isSettled: isSettledList[index],
      winner: Number(states[index]) === 2 ? Number(winners[index]) : undefined, // 2 = Ended
      createTime: createTimes[index],
      endTime: endTimes[index]
    }));
  }, [battlesData]);

  // endTime 기반으로 분류 (BattleArena와 동일한 로직)
  const activeBattles = battles.filter(battle => {
    const endTime = Number(battle.endTime);
    return battle.state === 1 && endTime > currentTime; // Active이면서 아직 시간이 남은 배틀
  });

  const completedBattles = battles.filter(battle => {
    const endTime = Number(battle.endTime);
    return battle.state === 2 || (battle.state === 1 && endTime <= currentTime); // Ended 상태이거나, Active지만 시간이 지난 배틀
  });

  const handleSelectBattle = (battleId: number) => {
    onSelectBattle(battleId);
    onClose();
  };

  const formatTimeAgo = (endTime: bigint, state: number) => {
    const time = Number(endTime);
    const remaining = time - currentTime;

    if (remaining > 0 && state === 1) {
      // 활성 배틀의 경우 남은 시간 표시
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);

      if (hours > 0) return `${hours}h ${minutes}m left`;
      return `${minutes}m left`;
    } else {
      // 완료된 배틀의 경우 종료된 시간 표시
      const diff = currentTime - time;
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const days = Math.floor(hours / 24);

      if (diff < 60) return 'Just ended';
      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      return `${minutes}m ago`;
    }
  };

  const getWinnerLabel = (winner: number) => {
    return winner === 0 ? 'ETH' : 'BTC';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Battle History">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-[#8B9299]">Loading battles...</p>
          </div>
        ) : (
          <>
            {/* Battle Stats */}
            <div className="bg-[#1e2429] rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#5AD8CC]">{battleCount ? Number(battleCount) : 0}</div>
                  <div className="text-xs text-[#8B9299]">Total Battles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#4ADE80]">{activeBattles.length}</div>
                  <div className="text-xs text-[#8B9299]">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#8B5CF6]">{completedBattles.length}</div>
                  <div className="text-xs text-[#8B9299]">Completed</div>
                </div>
              </div>
            </div>

            {/* Active Battles */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                🔥 Active Battles ({activeBattles.length})
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
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
                            ETH Monster #{battle.ethMonsterId} vs BTC Monster #{battle.btcMonsterId}
                          </div>
                          <div className="text-xs text-[#5AD8CC] mt-1">
                            {formatTimeAgo(battle.endTime, battle.state)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">
                            {formatMonAmount(battle.ethPool + battle.btcPool)} MON
                          </div>
                          <div className="text-xs text-[#8B9299]">Total Pool</div>
                          <div className="text-xs text-[#8B9299] mt-1">
                            ETH: {formatMonAmount(battle.ethPool)} | BTC: {formatMonAmount(battle.btcPool)}
                          </div>
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
              <div className="space-y-3 max-h-80 overflow-y-auto">
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
                            {battle.winner !== undefined && (
                              <span className="bg-[#4ADE80] text-black text-xs px-2 py-1 rounded-full font-bold">
                                {getWinnerLabel(battle.winner)} WON
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-[#8B9299]">
                            ETH Monster #{battle.ethMonsterId} vs BTC Monster #{battle.btcMonsterId}
                          </div>
                          <div className="text-xs text-[#8B9299] mt-1">
                            {formatTimeAgo(battle.endTime, battle.state)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">
                            {formatMonAmount(battle.ethPool + battle.btcPool)} MON
                          </div>
                          <div className="text-xs text-[#8B9299]">Total Pool</div>
                          <div className="text-xs text-[#8B9299] mt-1">
                            ETH: {formatMonAmount(battle.ethPool)} | BTC: {formatMonAmount(battle.btcPool)}
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
          </>
        )}
      </div>
    </Modal>
  );
}