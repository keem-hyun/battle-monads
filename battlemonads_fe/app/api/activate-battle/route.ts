import { NextRequest, NextResponse } from 'next/server';
import { checkEnvVariables, getContractInstance, logGasPrice } from '../../lib/apiUtils';
import { BATTLE_MONADS_ADDRESS } from '../../lib/contracts/BattleMonads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { battleId } = body;

    if (!battleId && battleId !== 0) {
      return NextResponse.json({ error: 'Battle ID is required' }, { status: 400 });
    }

    // 환경변수 체크
    const envError = checkEnvVariables();
    if (envError) return envError;

    console.log(`🎮 Activating battle #${battleId} via backend...`);

    // 프로바이더/월렛/컨트랙트
    const { provider, contract } = getContractInstance();

    // 💡 isReady를 짧게 폴링해서 레이스/시계 오차 완화 (최대 3초)
    let ready = false;
    for (let i = 0; i < 6; i++) {
      ready = await contract.isBattleReadyToActivate(battleId);
      if (ready) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!ready) {
      return NextResponse.json(
        { error: 'Battle is not ready to activate yet' },
        { status: 409 } // 409로 돌려주면 클라가 "상태 변화 중"으로 해석 가능
      );
    }

    // 가스 정보(옵션)
    await logGasPrice(provider);

    // 트랜잭션 전송
    const tx = await contract.checkAndActivateBattle(battleId);
    console.log('📝 Tx sent:', tx.hash);

    // 완료 대기
    const receipt = await tx.wait();
    console.log('✅ Activated! Block:', receipt?.blockNumber);

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      battleId: Number(battleId),
      gasUsed: receipt?.gasUsed ? Number(receipt.gasUsed) : null,
    });
  } catch (e: unknown) {
    // 이미 활성화 되었거나 중간에 상태 변화로 revert → 409로 반환해서 클라가 재동기화만 하게
    const error = e as { reason?: string; shortMessage?: string; message?: string; code?: string };
    const details = error?.reason || error?.shortMessage || error?.message || 'CALL_EXCEPTION';
    console.error('❌ Failed to activate battle:', details);

    return NextResponse.json(
      { error: 'Activation transaction reverted', details, code: error?.code || null },
      { status: 409 }
    );
  }
}

// 헬스체크용
export async function GET() {
  return NextResponse.json({
    status: 'Battle Activation API is running',
    timestamp: new Date().toISOString(),
    contract: BATTLE_MONADS_ADDRESS,
  });
}
