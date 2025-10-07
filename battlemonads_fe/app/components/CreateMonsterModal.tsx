'use client';

import React from 'react';
import { useBattleTimer } from '../hooks/useBattleTimer';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface CreateMonsterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 배틀 버튼 컴포넌트
interface CreateBattleButtonProps {
  onClick: () => void;
  className?: string;
}

export const CreateBattleButton: React.FC<CreateBattleButtonProps> = ({ onClick, className = '' }) => {
  const { countdown, isGenerating, isWaitingActivation, pendingBattleId } = useBattleTimer();

  const handleClick = () => {
    // 대기/생성 중이어도 모달은 열 수 있게
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-gradient-to-r from-[#5AD8CC] to-[#4ADE80] text-black hover:from-[#4ADE80] hover:to-[#5AD8CC] font-bold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${className}`}
      disabled={false}
    >
      {`  Next Battle  `}
    </button>

  );
};

export const CreateMonsterModal: React.FC<CreateMonsterModalProps> = ({ isOpen, onClose }) => {
  const { countdown, isGenerating, isWaitingActivation, lastBattleInfo, pendingBattleId } = useBattleTimer();

  // 아이콘, 큰 표시값, 보조 설명 텍스트를 상태에 맞춰 "문구만" 바꿈 (레이아웃은 동일)
  const icon = isGenerating ? '⚡' : (isWaitingActivation && pendingBattleId ? '⏳' : '⏰');

  // 카운트다운 자리: 생성 중이면 숫자 대신 문구를 그대로 노출
  const bigDisplay = isGenerating ? 'Creating…' : countdown;

  // 상단 제목 문구(레이아웃 동일, 텍스트만 변경)
  const heading = isGenerating
    ? 'Creating Battle'
    : (isWaitingActivation && pendingBattleId ? 'Waiting For New Battle' : 'Create New Battle');

  // 보조 설명 문구
  const subText = isGenerating
    ? 'Generating new ETH vs BTC battle on the blockchain'
    : (isWaitingActivation && pendingBattleId
        ? 'Battle will be available for betting after activation'
        : 'Battles are automatically generated at random intervals');

  // 큰 표시값 색상
  const bigColorClass = isGenerating
    ? 'text-[#5AD8CC]'
    : (isWaitingActivation ? 'text-[#F59E0B]' : 'text-[#5AD8CC]');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⏰ Next Battle Timer">
      <div className="space-y-6">
        {/* 상단 영역: 레이아웃 고정, 문구/아이콘/큰 표시값만 상태에 맞춰 변경 */}
        <div className="text-center">
          <div className="text-6xl mb-4">{icon}</div>

          <h3 className={`text-xl font-bold mb-2 ${isWaitingActivation && !isGenerating ? 'text-[#F59E0B]' : 'text-white'}`}>
            {heading}
          </h3>

          {/* 대기 중일 때는 보조 배너(배틀 ID & tx) 보여주기. 생성 중일 땐 건너뜀 */}
          {!isGenerating && isWaitingActivation && pendingBattleId && (
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B] rounded-lg p-3 mb-3 inline-block">
              <div className="text-sm text-[#F59E0B]">
                Battle #{pendingBattleId} waiting for activation
                {lastBattleInfo && (
                  <div className="text-xs opacity-75 mt-1">
                    Tx: {lastBattleInfo.txHash.slice(0, 10)}...{lastBattleInfo.txHash.slice(-8)}
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-[#8B9299] text-sm mb-4">{subText}</p>

          {/* 카운트다운/문구 공용 자리 */}
          <div className={`text-4xl font-mono font-bold ${bigColorClass} mb-4`}>
            {bigDisplay}
          </div>
        </div>

        {/* 하단 공용 영역(카드/남은 시간/닫기) — 생성 중에도 동일 레이아웃 유지 */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="eth" className="text-center p-4">
            <div className="text-4xl mb-2">🦄</div>
            <h4 className="text-white font-semibold">ETH Monster</h4>
            <p className="text-xs text-[#8B9299] mt-1">Ready to Battle</p>
          </Card>
          <Card variant="btc" className="text-center p-4">
            <div className="text-4xl mb-2">🦁</div>
            <h4 className="text-white font-semibold">BTC Monster</h4>
            <p className="text-xs text-[#8B9299] mt-1">Ready to Battle</p>
          </Card>
        </div>

        <div className="bg-[#1e2429] rounded-lg p-4 border border-[#2A3238]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold text-sm">Auto Battle System</h4>
              <p className="text-[#8B9299] text-xs mt-1">New battles spawn every 30s - 5min</p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${bigColorClass}`}>
                {bigDisplay /* 하단도 동일 표시 (생성 중이면 'Creating…') */}
              </div>
              <div className="text-[#8B9299] text-xs">Remaining</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} variant="secondary" className="px-8">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
