'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useBattleMonads } from '../hooks/useBattleMonads';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface CreateMonsterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMonsterModal: React.FC<CreateMonsterModalProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const { createBattle, isPending, useTransactionStatus } = useBattleMonads();

  const [isCreating, setIsCreating] = useState(false);

  const { data: txData, isSuccess, isError, isLoading: txLoading } = useTransactionStatus();

  useEffect(() => {
    if (isSuccess) {
      setIsCreating(false);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleCreateMonster = async () => {
    if (!address) return;

    setIsCreating(true);

    try {
      await createBattle();
    } catch (error) {
      console.error('Failed to create battle:', error);
      setIsCreating(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎨 Create Battle">
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h3 className="text-xl font-bold text-white mb-2">Start New Battle</h3>
          <p className="text-[#8B9299] text-sm mb-6">
            This will create a new battle with both ETH and BTC monsters
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card variant="eth" className="text-center p-4">
            <div className="text-4xl mb-2">🦄</div>
            <h4 className="text-white font-semibold">ETH Monster</h4>
            <p className="text-xs text-[#8B9299] mt-1">Initial HP: 100</p>
          </Card>
          <Card variant="btc" className="text-center p-4">
            <div className="text-4xl mb-2">🦁</div>
            <h4 className="text-white font-semibold">BTC Monster</h4>
            <p className="text-xs text-[#8B9299] mt-1">Initial HP: 100</p>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isCreating || txLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateMonster}
            variant="primary"
            disabled={isCreating || txLoading}
            className="flex-1"
          >
            {isCreating || txLoading ? 'Creating Battle...' : 'Create Battle'}
          </Button>
        </div>

        {isError && (
          <div className="text-[#F87171] text-sm text-center p-3 bg-[#F87171]/10 border border-[#F87171] rounded-lg">
            Failed to create monster. Please try again.
          </div>
        )}

        {isSuccess && (
          <div className="text-[#4ADE80] text-sm text-center p-3 bg-[#4ADE80]/10 border border-[#4ADE80] rounded-lg">
            🎉 Monster created successfully! Starting new battle...
          </div>
        )}
      </div>
    </Modal>
  );
};