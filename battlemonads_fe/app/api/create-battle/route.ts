import { NextResponse } from 'next/server';
import { checkEnvVariables, getContractInstance, logGasPrice } from '../../lib/apiUtils';
import { BATTLE_MONADS_ADDRESS } from '../../lib/contracts/BattleMonads';

export async function POST() {
  try {
    // 환경변수 확인
    const envError = checkEnvVariables();
    if (envError) return envError;

    console.log('🚀 Creating battle via backend...');

    // 컨트랙트 인스턴스 생성
    const { provider, contract } = getContractInstance();

    // 가스 가격 확인 (선택사항)
    await logGasPrice(provider);

    // createPendingBattle 트랜잭션 실행
    const tx = await contract.createPendingBattle();
    console.log('📝 Transaction sent:', tx.hash);

    // 트랜잭션 완료 대기
    const receipt = await tx.wait();
    console.log('✅ Battle created successfully! Block:', receipt?.blockNumber);

    // 이벤트 로그 파싱 (선택사항)
    let battleId = null;
    let ethMonsterId = null;
    let btcMonsterId = null;

    if (receipt?.logs) {
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog?.name === 'BattleCreated') {
            battleId = parsedLog.args[0];
            ethMonsterId = parsedLog.args[1];
            btcMonsterId = parsedLog.args[2];
            break;
          }
        } catch {
          // 로그 파싱 실패는 무시
        }
      }
    }

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      battleId: battleId ? Number(battleId) : null,
      ethMonsterId: ethMonsterId ? Number(ethMonsterId) : null,
      btcMonsterId: btcMonsterId ? Number(btcMonsterId) : null,
      gasUsed: receipt?.gasUsed ? Number(receipt.gasUsed) : null
    });

  } catch (error: unknown) {
    console.error('❌ Failed to create battle:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : null;

    return NextResponse.json(
      {
        error: 'Failed to create battle',
        details: errorMessage,
        code: errorCode
      },
      { status: 500 }
    );
  }
}

// GET 요청 처리 (헬스체크용)
export async function GET() {
  return NextResponse.json({
    status: 'Battle Creation API is running',
    timestamp: new Date().toISOString(),
    contract: BATTLE_MONADS_ADDRESS
  });
}