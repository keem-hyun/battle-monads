'use client';

import React from 'react';
import { Button } from './ui/Button';

interface HeaderProps {
  walletAddress?: string;
  onConnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ walletAddress, onConnect }) => {
  return (
    <header className="w-full bg-[#1a1f24] border-b border-[#2A3238]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚔️</span>
            <h1 className="text-xl font-bold text-[#5AD8CC]">
              Battle Monads
            </h1>
            <span className="text-xs text-[#8B9299] hidden sm:block">
              Price-based Monster Battles on Monad
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" />
              <span className="text-xs text-[#8B9299]">Monad Testnet</span>
            </div>
            
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div className="bg-[#121619] rounded-lg px-3 py-2">
                  <p className="text-xs text-[#8B9299]">Connected</p>
                  <p className="text-sm font-mono text-[#5AD8CC]">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
            ) : (
              <Button onClick={onConnect} size="sm">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};