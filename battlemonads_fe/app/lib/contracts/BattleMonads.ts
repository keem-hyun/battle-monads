export const BATTLE_MONADS_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_priceFeeds",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "BATTLE_DURATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "DEFAULT_HP",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_BET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_BET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addComment",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "content",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "battleComments",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "content",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isAttack",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "attackTarget",
        "type": "uint8",
        "internalType": "enum BattleMonads.MonsterType"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "bet",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "side",
        "type": "uint8",
        "internalType": "enum BattleMonads.MonsterType"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "canUserComment",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "checkAndActivateBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimReward",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createPendingBattle",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "endBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getActiveAndEndedBattles",
    "inputs": [
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "battleIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "ethMonsterIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "btcMonsterIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "createTimes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "endTimes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "states",
        "type": "uint8[]",
        "internalType": "enum BattleMonads.BattleState[]"
      },
      {
        "name": "isSettledList",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "winners",
        "type": "uint8[]",
        "internalType": "enum BattleMonads.MonsterType[]"
      },
      {
        "name": "ethPools",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "btcPools",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ethMonsterId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "btcMonsterId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "createTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "endTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "activationTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "state",
        "type": "uint8",
        "internalType": "enum BattleMonads.BattleState"
      },
      {
        "name": "isSettled",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "winner",
        "type": "uint8",
        "internalType": "enum BattleMonads.MonsterType"
      },
      {
        "name": "ethPool",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "btcPool",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBattleComments",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct BattleMonads.Comment[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "battleId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "user",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "content",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isAttack",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "attackTarget",
            "type": "uint8",
            "internalType": "enum BattleMonads.MonsterType"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBattleCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBattlesByStatus",
    "inputs": [
      {
        "name": "targetState",
        "type": "uint8",
        "internalType": "enum BattleMonads.BattleState"
      },
      {
        "name": "offset",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "battleIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "ethMonsterIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "btcMonsterIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "totalCount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLatestPendingInfo",
    "inputs": [],
    "outputs": [
      {
        "name": "exists",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "activationTime",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRecentBattles",
    "inputs": [
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "battleIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "ethMonsterIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "btcMonsterIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "createTimes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "endTimes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "activationTimes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "states",
        "type": "uint8[]",
        "internalType": "enum BattleMonads.BattleState[]"
      },
      {
        "name": "isSettledList",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "winners",
        "type": "uint8[]",
        "internalType": "enum BattleMonads.MonsterType[]"
      },
      {
        "name": "ethPools",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "btcPools",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserBets",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "ethBet",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "btcBet",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isBattleReadyToActivate",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "latestPendingId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "monsters",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "monsterType",
        "type": "uint8",
        "internalType": "enum BattleMonads.MonsterType"
      },
      {
        "name": "birthPrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentHP",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxHP",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "createTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "exists",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextBattleId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextCommentId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextMonsterId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "priceFeeds",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IPriceFeeds"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "startChain",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "usedAttacksAgainstBTC",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "usedAttacksAgainstETH",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "BattleActivated",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "activatedAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleCreated",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "ethMonsterId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "btcMonsterId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "ethBirthPrice",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "btcBirthPrice",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleEnded",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum BattleMonads.MonsterType"
      },
      {
        "name": "ethFinalHP",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "btcFinalHP",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleSettled",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "totalPayout",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BetPlaced",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "side",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum BattleMonads.MonsterType"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CommentAdded",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "content",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "isAttack",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "attackTarget",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum BattleMonads.MonsterType"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MonsterAttacked",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "target",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum BattleMonads.MonsterType"
      },
      {
        "name": "damage",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newHP",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardClaimed",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;

// Monad 테스트넷에 배포된 BattleMonads 컨트랙트 주소
export const BATTLE_MONADS_ADDRESS = '0xb89518A9d1166eCE8796403312A93c0cfEf55A7E';

// MonsterType enum
export enum MonsterType {
  ETH = 0,
  BTC = 1,
  SUI = 2,
  SOL = 3
}

// BattleState enum
export enum BattleState {
  Pending = 0,
  Active = 1,
  Ended = 2
}
