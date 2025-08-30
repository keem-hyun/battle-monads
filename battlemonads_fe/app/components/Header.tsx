'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { formatEther } from 'viem';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { monadTestnet } from '../config/wagmi';

export const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCorrectNetwork = chainId === monadTestnet.id;
  const networkName = isCorrectNetwork ? 'Monad Testnet' : `Chain ID: ${chainId}`;

  const handleConnect = () => {
    connect({ connector: metaMask() });
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: monadTestnet.id });
  };

  const formatBalance = (balance: bigint): string => {
    return Number(formatEther(balance)).toFixed(4);
  };

  // 서버 사이드 렌더링 중에는 기본 UI를 보여줌
  if (!mounted) {
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
                <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="text-xs text-[#8B9299]">Monad Testnet</span>
              </div>
              
              <Button 
                size="sm"
                disabled
                className="flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-500 fill-current">
                  <path d="M22.5 12c0-5.8-4.7-10.5-10.5-10.5S1.5 6.2 1.5 12 6.2 22.5 12 22.5 22.5 17.8 22.5 12zM12 20.5c-4.7 0-8.5-3.8-8.5-8.5S7.3 3.5 12 3.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/>
                </svg>
                Connect MetaMask
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }
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
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isCorrectNetwork ? 'bg-[#4ADE80]' : 'bg-[#F87171]'
              }`} />
              <span className="text-xs text-[#8B9299]">{networkName}</span>
              {!isCorrectNetwork && isConnected && (
                <Badge variant="warning" size="sm">Wrong Network</Badge>
              )}
            </div>
            
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <div className="bg-[#121619] rounded-lg px-3 py-2">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-500 fill-current">
                          <path d="M22.5 12c0-5.8-4.7-10.5-10.5-10.5S1.5 6.2 1.5 12 6.2 22.5 12 22.5 22.5 17.8 22.5 12zM12 20.5c-4.7 0-8.5-3.8-8.5-8.5S7.3 3.5 12 3.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/>
                          <path d="M15.3 10.1c-.2-.7-.7-1.2-1.4-1.4-.2-.1-.5-.1-.7-.1h-2.6c-.2 0-.4.2-.4.4v6c0 .2.2.4.4.4s.4-.2.4-.4v-2.2h2.2c.3 0 .5 0 .7-.1.7-.2 1.2-.7 1.4-1.4.1-.4.1-.8 0-1.2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#8B9299]">MetaMask</p>
                        <p className="text-sm font-mono text-[#5AD8CC]">
                          {address.slice(0, 6)}...{address.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#8B9299]">Balance</p>
                      <p className="text-sm font-semibold text-white">
                        {balance ? formatBalance(balance.value) : '0.0000'} MON
                      </p>
                    </div>
                  </div>
                </div>
                
                {!isCorrectNetwork && (
                  <Button 
                    onClick={handleSwitchNetwork}
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                  >
                    Switch Network
                  </Button>
                )}
                
                <Button 
                  onClick={() => disconnect()} 
                  size="sm" 
                  variant="ghost"
                  className="text-xs"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleConnect}
                size="sm"
                disabled={isPending}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  'Connecting...'
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-500 fill-current">
                      <path d="M22.5 12c0-5.8-4.7-10.5-10.5-10.5S1.5 6.2 1.5 12 6.2 22.5 12 22.5 22.5 17.8 22.5 12zM12 20.5c-4.7 0-8.5-3.8-8.5-8.5S7.3 3.5 12 3.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/>
                    </svg>
                    Connect MetaMask
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};