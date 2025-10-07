'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { BATTLE_MONADS_ABI, BATTLE_MONADS_ADDRESS } from '../lib/contracts/BattleMonads';

/** 카운트다운 표시용 타입 */
interface BattleTimer {
  timeRemaining: number;            // 남은 시간(ms)
  countdown: string;                // "M:SS" 포맷 문자열
  isGenerating: boolean;            // 백엔드에서 create-battle 진행 중
  pendingBattleId: number | null;   // 대기 중 배틀 ID (하나만 존재)
  activationTime: number | null;    // 활성화 예정 시각(ms)
  isWaitingActivation: boolean;     // 활성화 대기 중인지 여부
  lastBattleInfo?: {
    txHash: string;
    battleId: number;
    gasUsed: number;
  };
}

/** 전역 상태(여러 컴포넌트에서 같은 타이머/상태 공유) */
let globalTimer: BattleTimer = {
  timeRemaining: 0,
  countdown: '0:00',
  isGenerating: false,
  pendingBattleId: null,
  activationTime: null,
  isWaitingActivation: false,
};

/** 구독자(훅 사용 컴포넌트 setState) 리스트 */
const globalListeners: Set<(timer: BattleTimer) => void> = new Set();

/** 환경 독립적인 인터벌 타입 */
let globalInterval: ReturnType<typeof setInterval> | null = null;

/** 인터벌 중복 방지 플래그 */
let isInitialized = false;

/** 재시도 카운터 */
let retryCount = 0;
const MAX_RETRIES = 3;

/** "M:SS" 포맷 유틸 (마지막 1초 깔끔하게 올림 처리) */
function formatCountdownMs(ms: number) {
  if (ms <= 0) return '0:00';
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** ------------ 백엔드 API: 신규 배틀 생성 ------------ */
async function createNewBattle() {
  // 이미 생성 중이거나, 이미 대기 중 배틀이 있거나, 활성화 대기 중이면 skip
  if (globalTimer.isGenerating || globalTimer.isWaitingActivation || globalTimer.pendingBattleId) {
    console.log('⚠️ Skipping battle creation - already in progress or pending exists');
    return;
  }

  // 생성 시작 플래그 반영 + 구독자 통지
  globalTimer = { ...globalTimer, isGenerating: true };
  globalListeners.forEach((listener) => listener(globalTimer));

  try {
    console.log('🔄 Creating new battle...');

    const response = await fetch('/api/create-battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // 실패 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // "Pending exists" 는 정상 흐름(이미 하나 대기) → 에러 아님
      if (errorData?.details?.includes('Pending exists')) {
        console.log('ℹ️ Pending battle already exists, skipping creation');
        globalTimer = { ...globalTimer, isGenerating: false };
        globalListeners.forEach((listener) => listener(globalTimer));
        return;
      }

      throw new Error(`API Error: ${errorData?.error ?? 'Unknown'} - ${errorData?.details ?? ''}`);
    }

    const result = await response.json();
    console.log('✅ Battle created successfully!', {
      txHash: result.transactionHash,
      battleId: result.battleId,
      gasUsed: result.gasUsed,
    });

    const battleInfo = {
      txHash: result.transactionHash,
      battleId: result.battleId,
      gasUsed: result.gasUsed,
    };

    // 생성 성공 시 재시도 카운터 리셋
    retryCount = 0;

    // 생성 직후엔 아직 컨트랙트의 activationTime을 모름 → 훅의 read가 업데이트해 줌
    globalTimer = {
      ...globalTimer,
      isGenerating: false,
      pendingBattleId: result.battleId,
      isWaitingActivation: true,
      lastBattleInfo: battleInfo,
    };
    globalListeners.forEach((listener) => listener(globalTimer));
  } catch (error) {
    console.error('❌ Failed to create battle:', error);

    globalTimer = { ...globalTimer, isGenerating: false };
    globalListeners.forEach((listener) => listener(globalTimer));

    // 네트워크/일시 오류 시 재시도 (최대 3회)
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      console.log(`⏳ Retrying battle creation (${retryCount}/${MAX_RETRIES})...`);
      setTimeout(() => {
        createNewBattle();
      }, 10_000);
    } else {
      console.error(`❌ Max retries (${MAX_RETRIES}) reached. Stopping battle creation.`);
      retryCount = 0; // 리셋
    }
  }
}

/** ------------ 백엔드 API: 배틀 활성화 ------------ */
async function activateBattle(battleId: number) {
  try {
    console.log(`🎮 Activating battle #${battleId}...`);

    const response = await fetch('/api/activate-battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ battleId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Activation failed:', errorData);

      // 409 → 레이스/중복 활성화/아직 미세하게 준비안됨: 치명 아님, 최신 상태 재조회
      if (response.status === 409) {
        return;
      }

      // 기타 에러만 throw
      throw new Error(`Failed to activate battle: ${errorData?.error ?? ''} - ${errorData?.details ?? ''}`);
    }

    const result = await response.json();
    console.log(`✅ Battle #${battleId} activated successfully!`, result);

    // 활성화 성공 → 컨트랙트가 즉시 다음 pending을 만들었으므로 새 배틀 생성 트리거
    createNewBattle();
  } catch (error) {
    // CALL_EXCEPTION 등 revert 케이스 포함 → 409 전략으로 대부분 가려짐
    console.error(`❌ Failed to activate battle #${battleId}:`, error);
  }
}

/** ------------ 메인 훅 ------------ */
export function useBattleTimer() {
  const [timer, setTimer] = useState<BattleTimer>(globalTimer);

  /** 컨트랙트에서 "유일한 대기 배틀" 정보 읽기 */
  const { data: pendingInfo, refetch: refetchPending } = useReadContract({
    address: BATTLE_MONADS_ADDRESS,
    abi: BATTLE_MONADS_ABI,
    functionName: 'getLatestPendingInfo',
    // wagmi v2 이상: query 옵션 사용
    query: { refetchInterval: 3000 },
  });

  /** 배틀 카운트(초기 기동용) */
  const { data: battleCount } = useReadContract({
    address: BATTLE_MONADS_ADDRESS,
    abi: BATTLE_MONADS_ABI,
    functionName: 'getBattleCount',
  });

  /** 구독/해제(전역 상태 변동 시 setState 호출) */
  useEffect(() => {
    globalListeners.add(setTimer);
    return () => {
      globalListeners.delete(setTimer);
    };
  }, []);

  /** 온체인 pending 정보 수신 시 → 전역 상태 동기화 */
  useEffect(() => {
    if (!pendingInfo) {
      console.log('❌ No pending info available');
      return;
    }

    // getLatestPendingInfo() returns: (bool exists, uint256 battleId, uint256 activationTime)
    const [exists, battleId, activationTime] = pendingInfo as readonly [boolean, bigint, bigint];

    if (!exists) {
      console.log('⚠️ No pending battle exists');

      // 대기 배틀이 없고 지금 생성 중도/대기 중도 아님 → 새로 생성
      if (!globalTimer.isGenerating && !globalTimer.isWaitingActivation) {
        console.log('🔄 Creating new pending battle');
        createNewBattle();
      }
      return;
    }

    const activationTimeMs = Number(activationTime) * 1000;
    const currentBattleId = Number(battleId);
    const now = Date.now();
    const remaining = Math.max(activationTimeMs - now, 0);

    // 💡 동일 배틀ID라 하더라도 activationTime이나 상태가 다르면 "항상" 동기화
    const shouldUpdate =
      globalTimer.pendingBattleId !== currentBattleId ||
      globalTimer.activationTime !== activationTimeMs ||
      !globalTimer.isWaitingActivation;

    if (shouldUpdate) {
      globalTimer = {
        ...globalTimer,
        pendingBattleId: currentBattleId,
        activationTime: activationTimeMs,
        isWaitingActivation: true,
        isGenerating: false,
        timeRemaining: remaining,
        countdown: formatCountdownMs(remaining),
      };
      globalListeners.forEach((listener) => listener(globalTimer));
    }
  }, [pendingInfo]);

  /** 전역 인터벌(1초) - 단 한 번만 시작 */
  useEffect(() => {
    if (!isInitialized) {
      isInitialized = true;

      globalInterval = setInterval(() => {
        const now = Date.now();

        // 활성화 대기 중인 배틀이 있을 때만 카운트다운 계산
        if (globalTimer.isWaitingActivation && globalTimer.activationTime && globalTimer.pendingBattleId) {
          const remaining = globalTimer.activationTime - now;

          if (remaining <= 0) {
            // 🔔 활성화 시각 도달 → 백엔드 활성화 API 호출
            activateBattle(globalTimer.pendingBattleId);

            // 대기 상태 초기화
            globalTimer = {
              ...globalTimer,
              isWaitingActivation: false,
              pendingBattleId: null,
              activationTime: null,
              timeRemaining: 0,
              countdown: '0:00',
            };
          } else {
            // 계속 카운트다운 갱신
            globalTimer = {
              ...globalTimer,
              timeRemaining: remaining,
              countdown: formatCountdownMs(remaining),
            };
          }

          // 구독자에게 브로드캐스트
          globalListeners.forEach((listener) => listener(globalTimer));
        }

        // 대기 중이 아니고, 생성 중도 아니면 최신 pending 상태를 주기적으로 read
        if (!globalTimer.isWaitingActivation && !globalTimer.isGenerating) {
          refetchPending();
        }
      }, 1000);

      // 초기 상태: 배틀 하나도 없으면 만들기(옵션)
      if (battleCount === BigInt(0)) {
        createNewBattle();
      }
    }

    // 마지막 구독자가 사라지면 인터벌 정지(메모리 누수 방지)
    return () => {
      globalListeners.delete(setTimer);
      if (globalListeners.size === 0 && globalInterval) {
        clearInterval(globalInterval);
        globalInterval = null;
        isInitialized = false;
      }
    };
  }, [battleCount, refetchPending]);

  // 훅 사용처에는 전역 상태 스냅샷을 노출
  return { ...timer };
}
