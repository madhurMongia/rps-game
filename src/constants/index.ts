export const MOVES = ['select your move',"rock", "paper", "scissors", "spock","lizard"] as const;
export type Move = typeof MOVES[number];

export const RPSContractProperties = {
    PLAYER1_ADDRESS: 'j1', 
    PLAYER2_ADDRESS: 'j2', 
    PLAYER1_COMMITMENT_HASH: 'c1Hash', 
    PLAYER2_MOVE: 'c2', 
    STAKING_AMOUNT: 'stake',
    TIMEOUT_DURATION: 'TIMEOUT',
    LAST_ACTION_TIMESTAMP: 'lastAction', 
  };

export const RPSContractMethods = {
  PLAYER1TIMEOUT: 'j1Timeout', 
  PLAYER2TIMEOUT: 'j2Timeout', 
  SOLVE : 'solve',
  PLAY: 'play'
}

export type RPSContractPropertiesTypes = typeof RPSContractProperties;
export type RPSContractMethodsTypes = typeof RPSContractMethods;