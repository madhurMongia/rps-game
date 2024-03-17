export enum MoveType {
    Null,
    Rock,
    Paper,
    Scissors,
    Spock,
    Lizard,
}

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