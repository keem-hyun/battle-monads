# BattleMonads Contracts

Monad 블록체인 기반 예측 시장 배틀 게임 스마트 컨트랙트

## 프로젝트 구조

```
src/
├── PriceFeeds.sol          # Chainlink 가격 피드 연동
├── interfaces/
│   └── AggregatorV3Interface.sol  # Chainlink 인터페이스
script/
├── GetPrices.s.sol         # 가격 조회 스크립트
├── DeployPriceFeeds.s.sol  # 배포 스크립트
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
# Sepolia 테스트넷 배포
forge script script/DeployPriceFeeds.s.sol:DeployPriceFeeds \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### 컨트랙트 검증

```bash
forge verify-contract <CONTRACT_ADDRESS> PriceFeeds \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## 배포된 컨트랙트

### Sepolia 테스트넷
- **PriceFeeds Contract**: [`0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd`](https://sepolia.etherscan.io/address/0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd#code)
- **배포 트랜잭션**: [Etherscan에서 확인](https://sepolia.etherscan.io/address/0x2DE6e6e7f8CA732137775DF4Cff65571D47Db3Fd#code)

## Chainlink Data Feeds

현재 연동된 가격 피드 (Sepolia 테스트넷):

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