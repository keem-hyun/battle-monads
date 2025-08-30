# 예측 기반 '몬스터 배틀' NFT 게임

## 프로젝트 개요

**아이디어**: 플레이어가 몬스터 NFT를 민팅할 때 실시간 외부 데이터 기반 예측 이슈를 생성하고, 다른 플레이어들이 해당 이슈에 베팅하여 몬스터의 능력치 성장을 결정하는 예측 시장 기반 PvP 게임.

**목표**: 모나드의 고성능 환경을 활용해 빈번한 베팅과 배틀 트랜잭션을 구현하고, Chainlink Data Feeds를 통해 공정하고 예측 불가능한 게임 경험을 제공하는 것.

**참여 대상**: 몬스터 NFT를 민팅하는 창조자와 예측 이슈에 베팅하는 모든 플레이어.

## 게임 로직 상세 설계

### 1. 몬스터 생성 & NFT 시스템

**몬스터 민팅 프로세스**:
1. 플레이어가 몬스터 민팅 요청 (기본 민팅 비용 지불)
2. Chainlink VRF를 통해 몬스터의 기본 속성 랜덤 생성:
   - 타입 (Fire, Water, Earth, Air, Crypto)
   - 기본 스탯 (HP, ATK, DEF, SPD)
   - 외형 특성
3. 동시에 3-5개의 예측 이슈 자동 생성

### 2. 예측 이슈 시스템 (Multiple Issues per Monster)

**이슈 생성 로직**:
각 몬스터마다 다음과 같은 이슈들이 자동 생성됨:

1. **가격 예측 이슈**: 
   - "7일 후 ETH 가격이 $3000 이상일까?"
   - "BTC가 다음 주까지 $50000을 돌파할까?"

2. **지수 예측 이슈**:
   - "나스닥이 이번 달 말 현재보다 5% 상승할까?"
   - "S&P500이 다음 분기까지 하락할까?"

3. **날씨/환경 이슈**:
   - "뉴욕의 내일 최고기온이 20도 이상일까?"
   - "서울에 이번 주 비가 3일 이상 올까?"

4. **커뮤니티 이슈** (몬스터 특화):
   - "이 몬스터가 첫 배틀에서 승리할까?"
   - "이 몬스터의 HP가 1주일 후 100 이상이 될까?"

### 3. 베팅/스테이킹 메커니즘 (투표 대신)

**스테이킹 풀 시스템**:
1. **이슈별 이분법 풀**: 각 예측 이슈마다 "YES/NO" 두 개의 스테이킹 풀 생성
2. **동적 배당률**: 스테이킹 비율에 따라 실시간 배당률 계산
   - 예시: YES 풀에 70% 스테이킹 시 배당률 1.3x, NO 풀 배당률 2.8x
3. **락업 기간**: 이슈 해결까지 스테이킹 자금 락업 (7일~30일)

**스테이킹 인센티브**:
- **몬스터 성장 기여도**: 스테이킹 량에 비례해 몬스터 능력치 증가에 기여
- **배당 수익**: 올바른 예측 시 스테이킹 비율에 따른 배당 수익
- **거버넌스 토큰**: 스테이킹 참여 시 $MONSTER 토큰 보상

**리스크 관리**:
- **부분 출금**: 이슈 마감 24시간 전까지 50% 부분 출금 가능 (페널티 10%)
- **보험 풀**: 전체 스테이킹의 5%를 보험 풀로 적립하여 예상치 못한 손실 보전

### 4. 몬스터 능력치 성장 시스템

**Data Feeds 기반 보너스 적용**:

1. **가격 데이터 보너스**:
   - ETH 가격 상승률 > 5%: Crypto 타입 몬스터 ATK +10%
   - BTC 신고가 달성: 모든 몬스터 DEF +5%
   - 스테이블코인 디페깅: Water 타입 몬스터 SPD +15%

2. **주식 지수 보너스**:
   - 나스닥 상승: Tech 계열 스킬 몬스터 크리티컬 확률 +20%
   - S&P500 하락: 방어형 몬스터 HP 재생 +25%
   - VIX 지수 급등: 모든 몬스터 회피 확률 +10%

3. **날씨 데이터 보너스**:
   - 맑은 날씨: Fire 타입 ATK +20%, Water 타입 ATK -10%
   - 비/눈: Water 타입 SPD +25%, Fire 타입 SPD -15%
   - 극한 온도: 해당 지역 몬스터들 특별 버프/디버프

**스테이킹 기반 성장**:
- **집단 지성 효과**: 정답 풀에 스테이킹한 총량만큼 해당 이슈와 연관된 스탯 증가
- **개인 기여도**: 개인 스테이킹 비율에 따라 몬스터 소유자가 받는 보너스 차등 적용
- **연속 정답 보너스**: 3회 연속 정답 풀 선택 시 추가 능력치 보너스

### 5. 배틀 시스템

**실시간 데이터 영향**:
- 배틀 시작 시점의 실시간 Data Feeds 값이 배틀 환경 결정
- 몬스터별 누적된 스테이킹 성과가 최종 스탯에 반영
- 배틀 중 랜덤 이벤트 발생 시 실시간 데이터로 추가 효과 결정

## 게임 경제 & 토크노믹스

### $MONSTER 토큰 유틸리티

**획득 방법**:
- 정확한 예측으로 스테이킹 성공 시 보상
- 몬스터 배틀 승리 보상
- 일일/주간 스테이킹 참여 보너스

**사용 용도**:
- 몬스터 민팅 비용
- 프리미엄 이슈 생성 (특별 데이터 피드 활용)
- 스테이킹 부스터 아이템 구매
- 배틀 토너먼트 참가비

### 핵심 효과

**Monad의 이점**: 
- 빈번한 스테이킹과 실시간 배틀 트랜잭션을 초저비용으로 처리
- 복잡한 예측 시장 로직을 높은 TPS로 원활하게 실행
- 실시간 Data Feeds 업데이트에 따른 즉각적인 몬스터 스탯 변경

**Chainlink Data Feeds의 전략적 활용**: 
- 실제 금융/환경 데이터를 게임 코어에 접목하여 예측 불가능성 극대화
- 외부 데이터 기반 공정한 결과 도출로 조작 불가능한 게임 환경 구축
- 다양한 데이터 소스 활용으로 전략적 깊이와 재미 요소 증가

## 데이터 수집 및 활용

### 온체인 활동
- **내용**: 몬스터 NFT 민팅, 예측 이슈 생성, 스테이킹 풀 참여, 배틀 결과, 토큰 보상
- **수집 방식**: Monad 스마트 컨트랙트를 통한 직접 처리 및 이벤트 로그 수집

### 오프체인 데이터 (Chainlink Data Feeds)
- **가격 데이터**: ETH/USD, BTC/USD, 주요 알트코인 가격 피드
- **금융 지수**: 나스닥 종합지수, S&P 500, VIX 변동성 지수
- **환경 데이터**: 주요 도시 날씨, 온도, 습도 (Chainlink Functions 활용)
- **수집 방식**: 실시간 오라클 피드를 통한 자동 업데이트

### 예측 정확도 검증
- **자동 정산**: Data Feeds 값에 따른 예측 이슈 자동 해결
- **분쟁 해결**: 데이터 불일치 시 Chainlink의 검증된 피드를 최종 기준으로 사용
- **투명성**: 모든 데이터 소스와 계산 과정 온체인 공개

## 기술적 구현 방안

### 스마트 컨트랙트 구조
1. **MonsterNFT Contract**: ERC-721 기반 몬스터 생성 및 관리
2. **PredictionMarket Contract**: 예측 이슈 생성, 스테이킹 풀 관리
3. **DataOracle Contract**: Chainlink Data Feeds 통합 및 결과 정산
4. **Battle Contract**: 실시간 데이터 기반 배틀 로직 실행
5. **Token Contract**: $MONSTER 토큰 발행 및 보상 분배

## 해커톤 MVP 유스케이스 플로우

### 1단계: 몬스터 생성 및 자동 매칭

**몬스터 민팅 & 매칭**:
```
1. 플레이어 Alice가 몬스터 "FireDragon #001"을 민팅 (비용: 100 MONAD)
2. 플레이어 Bob이 몬스터 "WaterSerpent #002"를 민팅 (비용: 100 MONAD)
3. 시스템이 자동으로 두 몬스터를 매칭 (배틀 예약)
```

**각 몬스터별 예측 이슈 생성**:
```
FireDragon #001의 예측 이슈:
1. "24시간 내 ETH 가격이 $2,500 이상 도달할까?"
   - 종료: 2025-08-31 12:00 UTC
   - 스테이킹 풀: YES/NO

WaterSerpent #002의 예측 이슈:  
1. "24시간 내 BTC가 $65,000을 돌파할까?"
   - 종료: 2025-08-31 12:00 UTC
   - 스테이킹 풀: YES/NO
```

### 2단계: 커뮤니티 베팅 (예측 시장)

**베팅 과정**:
```
FireDragon #001 예측 시장:
- YES 풀: 1,500 MONAD (60%) - ETH가 $2,500 넘을 것
- NO 풀: 1,000 MONAD (40%) - ETH가 $2,500 못 넘을 것
총 스테이킹: 2,500 MONAD

WaterSerpent #002 예측 시장:
- YES 풀: 800 MONAD (32%) - BTC가 $65,000 넘을 것  
- NO 풀: 1,700 MONAD (68%) - BTC가 $65,000 못 넘을 것
총 스테이킹: 2,500 MONAD
```

### 3단계: 예측 시장 정산 → 몬스터 파워 결정

**24시간 후 Chainlink Data Streams 결과**:
```
- ETH 가격: $2,550 (FireDragon 예측 YES가 정답)
- BTC 가격: $64,500 (WaterSerpent 예측 NO가 정답)

몬스터 파워 계산:
- FireDragon: 기본 100 + (정답풀 1,500 / 100) = 115 파워
- WaterSerpent: 기본 100 + (정답풀 1,700 / 100) = 117 파워
```

### 4단계: 몬스터 배틀 실행 (실시간 데이터 반영)

**배틀 시 실시간 환경 변수 적용**:
```
배틀 시작 시점에 Chainlink Data Streams로 실시간 데이터 수집:
- 현재 ETH 가격 변동률 (1시간 기준)
- 현재 BTC 도미넌스
- 서울의 현재 날씨 (맑음/비/눈)
- 뉴욕 증시 변동성 지수 (VIX)
```

**환경 보정 예시**:
```
FireDragon vs WaterSerpent 배틀

기본 파워:
- FireDragon: 115 (예측 시장 보너스 포함)
- WaterSerpent: 117 (예측 시장 보너스 포함)

실시간 환경 보정 (Chainlink Data Streams):
- 서울 날씨: 비 → Fire 타입 -10%, Water 타입 +10%
- ETH 1시간 변동률: +3% → Crypto 속성 몬스터 +5%
- VIX 지수: 25 (높음) → 모든 몬스터 크리티컬 확률 +20%

최종 파워:
- FireDragon: 115 × 0.9 × 1.05 = 108.7
- WaterSerpent: 117 × 1.1 × 1.05 = 135.1
```

**배틀 실행 코드**:
```solidity
function executeBattle(uint256 matchId, bytes calldata weatherReport, bytes calldata priceReport) {
    Match memory match = matches[matchId];
    
    // 기본 파워 (예측 시장 결과 반영)
    uint256 basePower1 = monsters[match.monster1].basePower + 
                         calculatePredictionBonus(match.monster1);
    uint256 basePower2 = monsters[match.monster2].basePower + 
                         calculatePredictionBonus(match.monster2);
    
    // Chainlink Data Streams로 실시간 환경 데이터 가져오기
    EnvironmentFactors memory env = getEnvironmentFactors(weatherReport, priceReport);
    
    // 환경 보정 적용
    uint256 finalPower1 = applyEnvironmentBonus(match.monster1, basePower1, env);
    uint256 finalPower2 = applyEnvironmentBonus(match.monster2, basePower2, env);
    
    // 추가 랜덤 요소 (VRF 사용)
    uint256 random = getRandomNumber() % 20; // 0-19
    if (random < 2) { // 10% 확률로 약자가 크리티컬
        if (finalPower1 < finalPower2) finalPower1 *= 2;
        else finalPower2 *= 2;
    }
    
    // 최종 승자 결정
    uint256 winner = finalPower1 > finalPower2 ? match.monster1 : match.monster2;
    uint256 loser = finalPower1 > finalPower2 ? match.monster2 : match.monster1;
    
    // 패배 몬스터의 스테이킹 풀이 승리 몬스터로 이동
    transferStakingPool(loser, winner);
}

function applyEnvironmentBonus(uint256 monsterId, uint256 basePower, EnvironmentFactors memory env) 
    returns (uint256) {
    Monster memory monster = monsters[monsterId];
    uint256 power = basePower;
    
    // 날씨 보정
    if (env.weather == Weather.RAIN) {
        if (monster.type == MonsterType.FIRE) power = power * 90 / 100; // -10%
        if (monster.type == MonsterType.WATER) power = power * 110 / 100; // +10%
    } else if (env.weather == Weather.SUNNY) {
        if (monster.type == MonsterType.FIRE) power = power * 115 / 100; // +15%
        if (monster.type == MonsterType.WATER) power = power * 95 / 100; // -5%
    }
    
    // 암호화폐 시장 보정
    if (env.ethVolatility > 5) { // ETH 변동성 5% 이상
        if (monster.type == MonsterType.CRYPTO) power = power * 120 / 100; // +20%
    }
    
    // VIX 지수 보정 (시장 공포 지수)
    if (env.vixIndex > 30) { // 높은 변동성
        power = power * 105 / 100; // 모든 몬스터 +5% (혼란 보너스)
    }
    
    return power;
}
```

### 5단계: 최종 보상 분배

**보상 분배 구조**:
```
WaterSerpent #002 승리 시:
1. FireDragon의 스테이킹 풀 2,500 MONAD → WaterSerpent 풀로 이동
2. 총 보상 풀: 2,500 (원래) + 2,500 (패배자) = 5,000 MONAD

보상 분배:
- WaterSerpent 예측 정답자들 (NO 베터): 1,700 MONAD 스테이킹한 사람들이 비례 분배
- WaterSerpent 소유자 Bob: 추가 보너스
- 프로토콜 수수료: 5%
```

**최종 정산 코드**:

```solidity
// 배틀 후 최종 보상 계산
function distributeRewards(uint256 matchId) {
    Match memory match = matches[matchId];
    uint256 winner = match.winner;
    uint256 loser = match.loser;
    
    // 패배 몬스터의 총 스테이킹을 승리 몬스터 풀에 추가
    uint256 loserTotalStake = getTotalStake(loser);
    uint256 winnerCorrectPool = getCorrectPredictionPool(winner);
    
    // 프로토콜 수수료 5%
    uint256 protocolFee = loserTotalStake * 5 / 100;
    uint256 distributable = loserTotalStake - protocolFee;
    
    // 승리 몬스터의 정답 예측자들에게 분배
    for (address staker : winnerCorrectStakers) {
        uint256 stake = stakes[winner][staker];
        uint256 reward = stake + (distributable * stake / winnerCorrectPool);
        
        // MONAD 토큰 전송
        monadToken.transfer(staker, reward);
    }
    
    // 몬스터 소유자 추가 보너스 (패배 풀의 10%)
    uint256 ownerBonus = loserTotalStake * 10 / 100;
    monadToken.transfer(monsterOwner[winner], ownerBonus);
}
```

## 게임 메커니즘 핵심 특징

### 예측 시장과 배틀의 결합
1. **예측 시장이 몬스터 파워를 결정**: 커뮤니티가 예측을 잘할수록 몬스터가 강해짐
2. **Winner-takes-all**: 배틀 패배 시 모든 스테이킹 풀이 승자에게 이동
3. **이중 보상 구조**: 예측 정답 + 배틀 승리 시 최대 보상

### 전략적 깊이
- 예측 이슈 선택이 중요 (쉬운 예측 vs 어려운 예측)
- 커뮤니티 지지를 받는 몬스터가 유리
- 타이밍 전략: 언제 베팅할지, 얼마나 베팅할지

## Chainlink Data Streams 활용

### 왜 Data Streams가 필요한가?
- **Price Feeds 한계**: ETH, BTC, LINK 등 주요 자산만 지원
- **Data Streams 장점**: 
  - 더 다양한 자산 가격 지원
  - 저지연 실시간 업데이트 (수백 밀리초)
  - 과거 데이터 접근 가능 (평균값 계산용)

### Data Streams 구현 예시:

```solidity
contract PredictionMarket {
    IERC20 public monadToken; // MONAD 토큰 컨트랙트
    IDataStreamsVerifier public dataStreamsVerifier;
    
    function settlePrediction(uint256 issueId, bytes calldata report) external {
        Issue storage issue = issues[issueId];
        require(block.timestamp >= issue.endTime, "Not ended");
        
        // Data Streams 검증
        (bytes32[] memory feedIds, uint256[] memory prices, uint256 timestamp) = 
            dataStreamsVerifier.verifyReport(report);
        
        // ETH/USD 가격 확인 (feedId: 0x000359...)
        uint256 ethPrice = prices[0];
        
        // 결과 판정
        issue.result = ethPrice >= issue.targetPrice;
        issue.settled = true;
        
        // MONAD 토큰으로 정산 실행
        distributeMonadRewards(issueId);
    }
    
    function distributeMonadRewards(uint256 issueId) internal {
        // 승자들에게 MONAD 토큰 분배
        // ...
    }
}
```

### 토큰 이코노미

**MONAD 토큰 사용처**:
- 몬스터 NFT 민팅 (100 MONAD)
- 예측 시장 베팅 (최소 10 MONAD)
- 배틀 참가비 (5 MONAD)
- 특별 이슈 생성 (50 MONAD)

**MONAD 토큰 획득**:
- 예측 시장 승리 보상
- 몬스터 배틀 승리 (10-50 MONAD)
- 일일 퀘스트 완료 (1-5 MONAD)
- 스테이킹 풀 유동성 제공

### 평가 기준

**Data Feeds 활용 (20점)**:
- **아이디어 (10점)**: 예측 시장과 몬스터 성장을 연결한 창의적 게임 메커니즘
- **구현 (10점)**: 실시간 데이터 피드의 효과적 통합과 게임 로직 내 의미있는 활용

**추가 평가 요소**:
- **게임 완성도**: UI/UX, 기능 작동, 사용자 경험
- **Monad 활용**: 높은 TPS와 저비용 트랜잭션을 활용한 게임 설계
- **혁신성**: 기존 NFT 게임과 차별화된 예측 시장 결합 모델
- **지속가능성**: 토크노믹스와 게임 경제 생태계의 장기적 viability