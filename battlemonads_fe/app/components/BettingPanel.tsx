'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface BettingPanelProps {
  battleId: string;
  userBalance: number;
  userBets: {
    eth: number;
    btc: number;
  };
  onPlaceBet: (type: 'ETH' | 'BTC', amount: number) => void;
  onAttack: (target: 'ETH' | 'BTC') => void;
  canAttack: boolean;
}

export const BettingPanel: React.FC<BettingPanelProps> = ({
  battleId,
  userBalance,
  userBets,
  onPlaceBet,
  onAttack,
  canAttack,
}) => {
  const [selectedMonster, setSelectedMonster] = useState<'ETH' | 'BTC' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [attackComment, setAttackComment] = useState('');
  
  const handleBet = () => {
    if (selectedMonster && betAmount) {
      onPlaceBet(selectedMonster, parseFloat(betAmount));
      setBetAmount('');
      setSelectedMonster(null);
    }
  };
  
  const handleAttack = (target: 'ETH' | 'BTC') => {
    if (attackComment === 'attack') {
      onAttack(target);
      setAttackComment('');
    }
  };
  
  const totalBets = userBets.eth + userBets.btc;
  
  return (
    <Card className="w-full">
      <h3 className="text-xl font-bold text-white mb-4">Battle Controls</h3>
      
      <div className="space-y-4">
        <div className="bg-[#121619] rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[#8B9299]">Your Balance</span>
            <span className="text-lg font-bold text-[#5AD8CC]">
              {userBalance.toLocaleString()} MON
            </span>
          </div>
          
          {totalBets > 0 && (
            <div className="pt-3 border-t border-[#2A3238] space-y-2">
              <p className="text-xs text-[#8B9299]">Your Active Bets</p>
              {userBets.eth > 0 && (
                <div className="flex justify-between">
                  <Badge variant="eth">ETH Monster</Badge>
                  <span className="text-sm text-white">{userBets.eth} MON</span>
                </div>
              )}
              {userBets.btc > 0 && (
                <div className="flex justify-between">
                  <Badge variant="btc">BTC Monster</Badge>
                  <span className="text-sm text-white">{userBets.btc} MON</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm text-[#8B9299] mb-2">Place Your Bet</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setSelectedMonster('ETH')}
              className={`
                p-3 rounded-lg border transition-all
                ${selectedMonster === 'ETH' 
                  ? 'bg-[#627EEA]/20 border-[#627EEA] text-[#627EEA]' 
                  : 'bg-[#121619] border-[#2A3238] text-[#8B9299] hover:border-[#627EEA]/50'
                }
              `}
            >
              🦄 ETH Monster
            </button>
            <button
              onClick={() => setSelectedMonster('BTC')}
              className={`
                p-3 rounded-lg border transition-all
                ${selectedMonster === 'BTC' 
                  ? 'bg-[#F7931A]/20 border-[#F7931A] text-[#F7931A]' 
                  : 'bg-[#121619] border-[#2A3238] text-[#8B9299] hover:border-[#F7931A]/50'
                }
              `}
            >
              🦁 BTC Monster
            </button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-[#121619] border border-[#2A3238] rounded-lg px-3 py-2 text-white placeholder-[#5A6269] focus:outline-none focus:border-[#5AD8CC]"
            />
            <Button
              onClick={handleBet}
              disabled={!selectedMonster || !betAmount || parseFloat(betAmount) <= 0}
            >
              Place Bet
            </Button>
          </div>
        </div>
        
        {canAttack && (
          <div>
            <p className="text-sm text-[#8B9299] mb-2">Attack Command</p>
            <div className="bg-[#121619] rounded-lg p-3 mb-3">
              <p className="text-xs text-[#5AD8CC] mb-1">💡 Type "attack" to damage the enemy monster</p>
              <p className="text-xs text-[#8B9299]">Damage based on your bet amount (1% of bet, max 50)</p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={attackComment}
                onChange={(e) => setAttackComment(e.target.value)}
                placeholder='Type "attack"'
                className="flex-1 bg-[#121619] border border-[#2A3238] rounded-lg px-3 py-2 text-white placeholder-[#5A6269] focus:outline-none focus:border-[#5AD8CC]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAttack('ETH')}
                  variant="danger"
                  size="sm"
                  disabled={attackComment !== 'attack' || userBets.btc === 0}
                >
                  ⚔️ ETH
                </Button>
                <Button
                  onClick={() => handleAttack('BTC')}
                  variant="danger"
                  size="sm"
                  disabled={attackComment !== 'attack' || userBets.eth === 0}
                >
                  ⚔️ BTC
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};