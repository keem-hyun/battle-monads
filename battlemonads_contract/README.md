# BattleMonads Contracts

Monad 블록체인 기반 예측 시장 배틀 게임 스마트 컨트랙트

## 프로젝트 구조

```
src/
├── PriceFeeds.sol          # Chainlink 가격 피드 연동
├── BattleMonads.sol        # 메인 배틀 게임 컨트랙트
├── MonsterTypes.sol        # 몬스터 타입 정의
├── MonsterStorage.sol      # 몬스터 데이터 구조
├── BattleStorage.sol       # 배틀 데이터 구조
├── interfaces/
│   └── AggregatorV3Interface.sol  # Chainlink 인터페이스
script/
├── GetPrices.s.sol         # 가격 조회 스크립트
├── DeployPriceFeeds.s.sol  # PriceFeeds 배포 스크립트
├── DeployBattleMoands.s.sol # BattleMonads 배포 스크립트
test/
├── PriceFeeds.t.sol        # 가격 피드 테스트
```

## 환경 설정

### 1. 의존성 설치

```bash
forge install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 편집:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

## 주요 명령어

### 빌드

```bash
forge build
```

### 테스트

```bash
# 모든 테스트 실행
forge test

# Sepolia 포크로 테스트
forge test --fork-url $SEPOLIA_RPC_URL -vvv
```

### 가격 조회

실시간 BTC/ETH 가격 조회 (Sepolia 테스트넷):

```bash
source .env && forge script script/GetPrices.s.sol:GetPrices --fork-url $SEPOLIA_RPC_URL -vvv
```

### 배포

```bash
# Monad 테스트넷 - PriceFeeds 배포
forge script script/DeployPriceFeedsMonad.s.sol:DeployPriceFeedsMonad \
  --rpc-url monad \
  --private-key $PRIVATE_KEY \
  --broadcast

# Monad 테스트넷 - BattleMonads 배포
forge script script/DeployBattleMoands.s.sol:DeployBattleMonads \
  --rpc-url monad \
  --private-key $PRIVATE_KEY \
  --broadcast

# Sepolia 테스트넷 배포
forge script script/DeployPriceFeeds.s.sol:DeployPriceFeeds \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### 컨트랙트 검증

```bash
# Monad 테스트넷 검증 (Sourcify)
forge verify-contract \
  --rpc-url https://testnet-rpc.monad.xyz \
  --verifier sourcify \
  --verifier-url 'https://sourcify-api-monad.blockvision.org' \
  <CONTRACT_ADDRESS> \
  src/PriceFeeds.sol:PriceFeeds

# Sepolia 테스트넷 검증
forge verify-contract <CONTRACT_ADDRESS> PriceFeeds \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## 배포된 컨트랙트

### Monad 테스트넷
- **PriceFeeds Contract**: [`0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd`](https://testnet.monadscan.com/address/0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd#code)
- **BattleMonads Contract**: [`0x69366b194C707105186f2e889cAB84306c716E60`](https://testnet.monadscan.com/address/0x69366b194c707105186f2e889cab84306c716e60#code)
- **배포 트랜잭션**: [MonadScan에서 확인](https://testnet.monadscan.com/address/0x69366b194c707105186f2e889cab84306c716e60#code)

### Sepolia 테스트넷
- **PriceFeeds Contract**: [`0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd`](https://sepolia.etherscan.io/address/0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd#code)
- **배포 트랜잭션**: [Etherscan에서 확인](https://sepolia.etherscan.io/address/0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd#code)

## 게임 기능

### BattleMonads 컨트랙트 주요 기능
- **베팅 시스템**: 0.01 ~ 1 MON 범위에서 ETH/BTC 선택 베팅
- **댓글 & 공격**: 베팅한 사용자만 댓글 작성 가능, "attack" 포함 시 자동 공격
- **실시간 가격**: 몬스터 생성 시 Chainlink 가격 데이터로 birth price 설정
- **자동 정산**: 배틀 종료 시 승자 풀이 전체 베팅 금액 분배
- **배틀 시간**: 1시간 제한, HP 0 또는 시간 만료 시 자동 종료

### 게임 플로우
1. **배틀 생성**: 관리자가 ETH vs BTC 몬스터 배틀 생성
2. **베팅**: 사용자가 원하는 몬스터에 베팅 (0.01-1 MON)
3. **댓글/공격**: 베팅한 사용자만 댓글 작성, "attack" 포함 시 반대편 공격
4. **배틀 종료**: HP 0 또는 1시간 경과 시 자동 종료
5. **정산**: 승자 풀이 베팅 비율에 따라 보상 분배

## Chainlink Data Feeds

### Monad 테스트넷
| Feed | Address | Decimals |
|------|---------|----------|
| BTC/USD | 0x2Cd9D7E85494F68F5aF08EF96d6FD5e8F71B4d31 | 8 |
| ETH/USD | 0x0c76859E85727683Eeba0C70Bc2e0F5781337818 | 8 |

### Sepolia 테스트넷

| Feed | Address | Decimals |
|------|---------|----------|
| BTC/USD | 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43 | 8 |
| ETH/USD | 0x694AA1769357215DE4FAC081bf1f309aDC325306 | 8 |

## 개발 도구

### Forge 명령어

```bash
# 컨트랙트 크기 확인
forge build --sizes

# 가스 스냅샷
forge snapshot

# 코드 포맷팅
forge fmt
```

### Cast 명령어

```bash
# 컨트랙트 함수 호출
cast call <CONTRACT_ADDRESS> "getBTCPrice()" --rpc-url $SEPOLIA_RPC_URL

# 트랜잭션 전송
cast send <CONTRACT_ADDRESS> "functionName()" --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

### Anvil (로컬 테스트넷)

```bash
# 로컬 테스트넷 실행
anvil

# 포크 모드로 실행
anvil --fork-url $SEPOLIA_RPC_URL
```

## 문서

- [Foundry 문서](https://book.getfoundry.sh/)
- [Chainlink Data Feeds](https://docs.chain.link/data-feeds)
- [Monad 문서](https://docs.monad.xyz/)