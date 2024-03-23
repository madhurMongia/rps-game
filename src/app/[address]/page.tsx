"use client";
import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { RPSContractProperties } from '@/constants';
import { Player1Session } from './player1';
import { AppContainer } from '@/components/battleSetup.styles';
import { ErrorPrompt, SuccessPrompt } from '@/components/shared';
import {useTimer} from 'react-timer-hook';
import { redirect } from 'next/navigation';
import { Player2Session } from './player2';
import GameEnd from './gameEnd';

const GameSession = ({ params }: { params: { address: any } }) => {
  const { address: contractAddress } = params;
  const { address: player } = useAccount();

  const { data: player2Move } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER2_MOVE,
  });

  const { data: stake } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.STAKING_AMOUNT,
  });

  const { isLoading:isLoadingPlayer1, data: player1 } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER1_ADDRESS,
  });

  const { data: lastAction } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.LAST_ACTION_TIMESTAMP,
  });

  const { data: TIMEOUT } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.TIMEOUT_DURATION,
  });

  const { isLoading:isLoadingPlayer2, data: player2 } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER2_ADDRESS,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccessMessage] = useState<string | null>(null);
  const [showClaimButton, setShowClaimButton] = useState(false);

  const {
    writeContract,
    data:TransactionData,
  } = useWriteContract({
    mutation : {
      onError : (e) => setError(e.message),
    }
  });
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(
      (Number(lastAction || 0) + Number(TIMEOUT || 0)) * 1000, 
    ),
    autoStart: true,
    onExpire: () => setShowClaimButton(true),
  });

  useEffect(() => {
    if (!TIMEOUT || !lastAction) return;

    restart(
      new Date(
        (Number(lastAction || 0) + Number(TIMEOUT || 0)) * 1000,
      ),
    );
  }, [lastAction]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout ;

    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 10000);
    }
    return () => clearTimeout(timeoutId);
  }, [error]);

  if (!isLoadingPlayer1 && !isLoadingPlayer2 && ![player1, player2].includes(player)) {
    return redirect('/');
  }

  return (
      <AppContainer>
        {stake == 0 ? (
        <GameEnd contractAddress={contractAddress}/>
        ) : player == player1 ? (
          <Player1Session
            contractAddress={contractAddress}
            minutes={minutes}
            seconds={seconds}
            player2Move={player2Move}
            showClaimButton={showClaimButton}
            setShowClaimButton = {setShowClaimButton}
            player1={player1}
            stake={stake}
            player2={player2}
            setError={setError}
            writeContract={writeContract}
            TransactionData={TransactionData}
            setSuccessMessage ={ setSuccessMessage}
          />
        ) : player == player2 ? (
          <Player2Session
            contractAddress={contractAddress}
            minutes={minutes}
            seconds={seconds}
            player2Move={player2Move}
            showClaimButton={showClaimButton}
            setShowClaimButton = {setShowClaimButton}
            player1={player1}
            stake={stake}
            player2={player2}
            setError={setError}
            writeContract={writeContract}
            TransactionData={TransactionData}
            setSuccessMessage = {setSuccessMessage}
          />
        ) : null}
        {error && <ErrorPrompt>{error}</ErrorPrompt>}
        {success && <SuccessPrompt>{success}</SuccessPrompt>}
      </AppContainer>
  );
}
export default GameSession;