import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BATTLE_MONADS_ABI, BATTLE_MONADS_ADDRESS } from './contracts/BattleMonads';

/**
 * 환경변수 체크 및 에러 응답 반환
 */
export function checkEnvVariables(): NextResponse | null {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const rpcUrl = process.env.MONAD_RPC;

  if (!privateKey) {
    return NextResponse.json(
      { error: 'Admin private key not configured' },
      { status: 500 }
    );
  }

  if (!rpcUrl) {
    return NextResponse.json(
      { error: 'Monad RPC URL not configured' },
      { status: 500 }
    );
  }

  return null;
}

/**
 * 초기화된 컨트랙트 인스턴스 반환
 */
export function getContractInstance() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY!;
  const rpcUrl = process.env.MONAD_RPC!;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    BATTLE_MONADS_ADDRESS,
    BATTLE_MONADS_ABI,
    wallet
  );

  return { provider, wallet, contract };
}

/**
 * 가스 가격 확인 및 로깅
 */
export async function logGasPrice(provider: ethers.JsonRpcProvider) {
  const feeData = await provider.getFeeData().catch(() => null);
  if (feeData?.gasPrice) {
    console.log('💰 Gas price:', ethers.formatUnits(feeData.gasPrice, 'gwei'), 'gwei');
  } else {
    console.warn('⚠️ Could not fetch gas price');
  }
}
