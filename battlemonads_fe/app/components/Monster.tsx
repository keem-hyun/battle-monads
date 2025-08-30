'use client';

import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';

interface MonsterProps {
  id: string;
  type: 'ETH' | 'BTC';
  currentHP: number;
  maxHP: number;
  birthPrice: number;
  currentPrice: number;
  owner: string;
  isInBattle?: boolean;
}

export const Monster: React.FC<MonsterProps> = ({
  id,
  type,
  currentHP,
  maxHP,
  birthPrice,
  currentPrice,
  owner,
  isInBattle = false,
}) => {
  const priceChange = ((currentPrice - birthPrice) / birthPrice) * 100;
  const isPositive = priceChange >= 0;
  
  const monsterEmoji = type === 'ETH' ? '🦄' : '🦁';
  const variant = type === 'ETH' ? 'eth' : 'btc';
  
  return (
    <Card variant={variant} glow={isInBattle} className="relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{monsterEmoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{type} Monster</h3>
              <Badge variant={variant} size="sm">{type}</Badge>
            </div>
            <p className="text-xs text-[#8B9299] mt-1">#{id.slice(0, 8)}</p>
          </div>
        </div>
        {isInBattle && (
          <Badge variant="warning">In Battle</Badge>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <ProgressBar
            value={currentHP}
            max={maxHP}
            variant={variant}
            showLabel
            label="HP"
            height="lg"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#121619] rounded-lg p-3">
            <p className="text-xs text-[#8B9299] mb-1">Birth Price</p>
            <p className="text-lg font-semibold text-white">
              ${birthPrice.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-[#121619] rounded-lg p-3">
            <p className="text-xs text-[#8B9299] mb-1">Current Price</p>
            <p className="text-lg font-semibold text-white">
              ${currentPrice.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-[#121619] rounded-lg p-3">
          <p className="text-xs text-[#8B9299] mb-1">Price Change</p>
          <p className={`text-xl font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
          <p className="text-xs text-[#8B9299] mt-1">
            HP Recovery: {isPositive ? '+' : ''}{Math.floor(priceChange * (isPositive ? 10 : 5))} HP/5min
          </p>
        </div>
        
        <div className="pt-3 border-t border-[#2A3238]">
          <p className="text-xs text-[#8B9299]">Owner</p>
          <p className="text-sm text-[#5AD8CC] font-mono">
            {owner.slice(0, 6)}...{owner.slice(-4)}
          </p>
        </div>
      </div>
    </Card>
  );
};