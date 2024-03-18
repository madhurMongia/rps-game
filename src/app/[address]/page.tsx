"use client";
import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { redirect } from 'next/navigation';
import { RPSContractProperties } from '@/constants';
import { Player1Session } from './player1';
import styled from 'styled-components';
import { AppContainer } from '@/components/battleSetup.styles';
import { ErrorPrompt } from '@/components/shared/error.styles';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const GameSession = ({ params }: { params: { address: any } }) => {
  const { address: contractAddress } = params;
  const { address: player } = useAccount();

  const { data: move2 } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER2_MOVE,
  });

  const { data: stake } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.STAKING_AMOUNT,
  });

  const { data: player1 } = useReadContract({
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

  const { data: player2 } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER2_ADDRESS,
  });

  const {
    status: claimTimeoutStatus,
    writeContract: claimTimeout,
    data: claimTimeoutTransactionData,
  } = useWriteContract();

  const [gameStatus, setGameStatus] = useState('Waiting for Player 2...');
  const [player2Played, setPlayer2Played] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIMEOUT);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [showSolveButton, setShowSolveButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const claimTimeoutHandler = async () => {
    try {
      claimTimeout({
        abi: RPSContractABI,
        address: contractAddress,
        functionName : 'claimTimeout',

      });
      alert('Timeout claimed. Player 1 is the winner by default.');
      setShowClaimButton(false);
    } catch (error) {
      console.error('Error claiming timeout:', error);
    }
  };

  const solveGameHandler = () => {
    alert('Game will now be resolved. Displaying results...');
    setShowSolveButton(false);
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prevTime: number) => {
        if (prevTime <= 0) {
          clearInterval(countdownInterval);
          setGameStatus('Time has expired!');
          setShowClaimButton(true);
          return 0;
        } else if (move2) {
          clearInterval(countdownInterval);
          setGameStatus('Player 2 has made their move!');
          setPlayer2Played(true);
          setShowSolveButton(true);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [move2, TIMEOUT, lastAction]);

  useEffect(() => {
    if (
      move2 !== undefined &&
      stake !== undefined &&
      player1 !== undefined &&
      lastAction !== undefined &&
      TIMEOUT !== undefined &&
      player2 !== undefined
    ) {
      setIsLoading(false);
    }
  }, [move2, stake, player1, lastAction, TIMEOUT, player2]);
  if (isLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  if (![player1, player2].includes(player)) {
    return redirect('/');
  }

  return (
    <>
    <AppContainer>
      {
      player === player1 && <Player1Session 
      gameStatus = {gameStatus}
      player2Played = {player2Played}
      timeRemaining = {timeRemaining}
      showClaimButton = {showClaimButton}
      showSolveButton = {showSolveButton}
      player1 = {player1}
      stake = {stake}
      player2 = {player2}
      claimTimeoutHandler = {claimTimeoutHandler}
      solveGameHandler = {solveGameHandler}
       />
      }
      {error && <ErrorPrompt>{error}</ErrorPrompt>}
      </AppContainer>
      </>
  );
};

export default GameSession;