export const MOVES = ["rock", "paper", "scissors", "lizard", "spock"] as const;
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
  
  export type RPSContractPropertiesTypes = typeof RPSContractProperties;