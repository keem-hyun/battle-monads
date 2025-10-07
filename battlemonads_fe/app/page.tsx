'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePriceFeeds } from './hooks/usePriceFeeds';
import { useBattleMonads } from './hooks/useBattleMonads';
import { Header } from './components/Header';
import { BattleArena } from './components/BattleArena';
import { BettingPanel } from './components/BettingPanel';
import { PriceTicker } from './components/PriceTicker';
import { CommentSection } from './components/CommentSection';
import { CreateMonsterModal, CreateBattleButton } from './components/CreateMonsterModal';
import { BattleListModal } from './components/BattleListModal';
import { Card } from './components/ui/Card';

export default function Home() {
  const { address } = useAccount();
  const { prices } = usePriceFeeds();
  const { useBattle, useLatestActiveBattle } = useBattleMonads();

  const [currentBattleId, setCurrentBattleId] = useState<number>(1);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBattleList, setShowBattleList] = useState(false);

  // 최신 활성 배틀 가져오기
  const { data: latestActiveBattleData } = useLatestActiveBattle();
  const { data: battle } = useBattle(currentBattleId);

  // state: 0 = Pending, 1 = Active, 2 = Ended
  const battleState = battle ? Number(battle[6]) : null;
  const activeBattle = battleState === 1;
  const endedBattle = battleState === 2;
  const showBattle = activeBattle || endedBattle;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 최신 활성 배틀 초기 선택 (처음 로드 시에만)
  useEffect(() => {
    if (latestActiveBattleData && currentBattleId === 1) {
      const [battleIds, , , , , states] = latestActiveBattleData;

      if (battleIds.length > 0) {
        const latestBattleId = Number(battleIds[0]);
        const latestState = Number(states[0]);

        // state가 1(Active)인 경우만 자동 선택 (초기 로드 시에만)
        if (latestState === 1 && latestBattleId > 1) {
          console.log('🎯 Initial battle selection:', latestBattleId);
          setCurrentBattleId(latestBattleId);
        }
      }
    }
  }, [latestActiveBattleData, currentBattleId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#121619]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              ⚔️ Battle Monads ⚔️
            </h2>
            <p className="text-[#8B9299] mb-4">
              Real-time price-based monster battles powered by Chainlink Data Feeds on Monad
            </p>
            <div className="flex justify-center gap-4">
              <CreateBattleButton onClick={() => setShowCreateModal(true)} />
              <button
                onClick={() => setShowBattleList(true)}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white font-bold px-6 py-2 rounded-lg hover:from-[#A78BFA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105"
              >
                📋 Battle History
              </button>
            </div>
          </div>
          
          {showBattle ? (
            <>
              <BattleArena battleId={currentBattleId} />

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PriceTicker prices={prices} lastUpdate={lastUpdate} />
                </div>
                <div>
                  {activeBattle ? (
                    <BettingPanel battleId={currentBattleId} />
                  ) : endedBattle ? (
                    <Card className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#A78BFA]/20 border-[#8B5CF6]/30">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🏆</div>
                        <h3 className="text-xl font-bold text-white mb-2">Battle Completed</h3>
                        <p className="text-[#8B9299] text-sm mb-4">
                          This battle has ended. Check the winner above!
                        </p>
                        <button
                          onClick={() => setShowBattleList(true)}
                          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white font-bold px-4 py-2 rounded-lg hover:from-[#A78BFA] hover:to-[#8B5CF6] transition-all duration-300"
                        >
                          📋 View All Battles
                        </button>
                      </div>
                    </Card>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Active Battle</h3>
                <p className="text-[#8B9299] mb-6">
                  Create your monster and start a new battle!
                </p>
                {mounted && address && (
                  <>
                    <p className="text-sm text-[#5AD8CC] mb-4">
                      Connected: {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                    <div className="flex justify-center">
                      <CreateBattleButton
                        onClick={() => setShowCreateModal(true)}
                        className="px-8 py-3"
                      />
                    </div>
                  </>
                )}
              </Card>
              
              <PriceTicker prices={prices} lastUpdate={lastUpdate} />
            </div>
          )}
          
          {showBattle && (
            <CommentSection battleId={currentBattleId} />
          )}
          
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

      {/* Modals */}
      <CreateMonsterModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <BattleListModal
        isOpen={showBattleList}
        onClose={() => setShowBattleList(false)}
        onSelectBattle={setCurrentBattleId}
        currentBattleId={currentBattleId}
      />
    </div>
  );
}
