import { Subtitle, Title } from "@/components/battleSetup.styles";
import { Button } from "@/components/shared/button.styles";
import styled from "styled-components";
import { formatEther } from "viem";

const Card = styled.div`
  background: rgba(31, 41, 55, 1);
  width: 40vw;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  font-family: 'Roboto', sans-serif;
`;

const InfoText = styled.p`
  font-size: 1.125rem;
  color: #9ca3af;
  margin-bottom: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusText = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #fbbf24;
  text-align: center;
  margin-top: 2rem;
`;

const Countdown = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #10b981;
  text-align: center;
  margin-top: 1.5rem;
`;

export function Player1Session({
  stake,
  player1,
  player2,
  timeRemaining,
  gameStatus,
  claimTimeoutHandler,
  showClaimButton,
  showSolveButton,
  solveGameHandler
}: any) {
    console.log([stake, player1, player2])
  return (
    <Card>
      <Title>Game Status</Title>
      <InfoText>Amount Staked: {formatEther(stake)} ETH</InfoText>
      <InfoText>Player 1: {player1}</InfoText>
      <InfoText>Player 2: {player2}</InfoText>
      <StatusText>{gameStatus}</StatusText>
      <Countdown>
        {`${Math.floor(timeRemaining / 60)
          .toString()
          .padStart(2, "0")}:${(timeRemaining % 60).toString().padStart(2, "0")}`}
      </Countdown>  
        {showClaimButton && (
          <Button onClick={claimTimeoutHandler}>Claim Timeout</Button>
        )}
        {showSolveButton && (
          <Button onClick={solveGameHandler}>Solve Game</Button>
        )}
    </Card>
  );
}