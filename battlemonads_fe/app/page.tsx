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
import { CreateMonsterModal } from './components/CreateMonsterModal';
import { Card } from './components/ui/Card';

export default function Home() {
  const { address } = useAccount();
  const { prices } = usePriceFeeds();
  const { useBattle } = useBattleMonads();
  
  // 현재는 battleId 1번을 고정으로 사용 (실제로는 활성 배틀 목록에서 선택)
  const currentBattleId = 1;
  const { data: battle } = useBattle(currentBattleId);
  
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBattleList, setShowBattleList] = useState(false);
  
  const activeBattle = battle && battle[5]; // isActive 필드
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#5AD8CC] to-[#4ADE80] text-black font-bold px-6 py-2 rounded-lg hover:from-[#4ADE80] hover:to-[#5AD8CC] transition-all duration-300 transform hover:scale-105"
              >
                🎨 Create Monster
              </button>
              <button
                onClick={() => setShowBattleList(true)}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white font-bold px-6 py-2 rounded-lg hover:from-[#A78BFA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105"
              >
                📋 Battle History
              </button>
            </div>
          </div>
          
          {activeBattle ? (
            <>
              <BattleArena battleId={currentBattleId} />
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PriceTicker prices={prices} lastUpdate={lastUpdate} />
                </div>
                <div>
                  <BettingPanel battleId={currentBattleId} />
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
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-[#5AD8CC] to-[#4ADE80] text-black font-bold px-8 py-3 rounded-lg hover:from-[#4ADE80] hover:to-[#5AD8CC] transition-all duration-300 transform hover:scale-105"
                      >
                        🎨 Create Monster
                      </button>
                    </div>
                  </>
                )}
              </Card>
              
              <PriceTicker prices={prices} lastUpdate={lastUpdate} />
            </div>
          )}
          
          {activeBattle && (
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
    </div>
  );
}
