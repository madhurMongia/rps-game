"use client";
import React, {useEffect, useState } from 'react';
import { useAccount, useReadContract, useWatchBlocks, useWriteContract } from 'wagmi';
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { MOVES, RPSContractMethods, RPSContractProperties } from '@/constants';
import { Player1Session } from './player1';
import { AppContainer } from '@/components/battleSetup.styles';
import { ErrorPrompt, SuccessPrompt } from '@/components/shared';
import {useTimer} from 'react-timer-hook';
import { redirect } from 'next/navigation';
import { Player2Session } from './player2';
const GameEnd = dynamic(() => import('./gameEnd'), { ssr: false })
import { getWinner } from '@/utils';
import { decodeFunctionData } from 'viem';
import { useLocalStorage } from '@/hooks';
import dynamic from 'next/dynamic';

const GameSession = ({ params }: { params: { address: any } }) => {
  const { address: contractAddress } = params;
  const { address: player } = useAccount();
  const { data: player2Move, refetch: refetchPlayer2Move } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER2_MOVE,
  });

  const [_, endGameMessage, setEndGameMassage] = useLocalStorage(`endGame-${contractAddress}`, undefined);
  
  const { data: stake } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.STAKING_AMOUNT,
  });
  
  const { isLoading: isLoadingPlayer1, data: player1 } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER1_ADDRESS,
  });
  
  const { data: lastAction, refetch: refetchLastAction } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.LAST_ACTION_TIMESTAMP,
  });
  
  const { data: TIMEOUT } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.TIMEOUT_DURATION,
  });
  
  const { isLoading: isLoadingPlayer2, data: player2 } = useReadContract({
    abi: RPSContractABI,
    address: contractAddress,
    functionName: RPSContractProperties.PLAYER2_ADDRESS,
  });

  const [enabledWatchBlock, setWatchBlock] = useState(false);

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
    onExpire: () => {
      setShowClaimButton(true)
      setWatchBlock(true)
    },
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

  useEffect(() => {
    const interval = setInterval(() => {
      refetchPlayer2Move();
      refetchLastAction();
    }, 2000); 

    return () => clearInterval(interval);
  }, []); 


  if (!isLoadingPlayer1 && !isLoadingPlayer2 && ![player1, player2].includes(player)) {
    return redirect('/');
  }
  const processBlock = (block:any) => {
    const transactions = block.transactions;
    console.log(transactions.length)
    transactions.forEach((tx:any) => {
        if(tx.from == String(player1).toLowerCase()){
          const functionData = decodeFunctionData({abi: RPSContractABI, data: tx.input});
            if(functionData.functionName == RPSContractMethods.SOLVE){
                const player1Move:any = functionData.args?.[0]
                let msg = "";
                if(getWinner(player1Move,Number(player2Move))){
                  if(player == player1)
                  msg = `Congratulations!,You won there move was ${MOVES[Number(player2Move)]}`
                  else 
                  msg = `Sorry!,You lost there move was ${MOVES[Number(player1Move)]} better luck next time!`
                }
                else if(getWinner(Number(player2Move),player1Move)){
                  if(player == player1)
                    msg =`Sorry!,You lost there move was ${MOVES[Number(player2Move)]} better luck next time!`
                  else
                    msg = `Congratulations!,You won there move was ${MOVES[Number(player1Move)]}`
                }
                else {
                    msg = `Tie!,there move was ${player == player1 ? MOVES[Number(player2Move)] : MOVES[Number(player1Move)]}`
                }
                setEndGameMassage(`endGame-${contractAddress}`, msg);
            }
            else if(functionData.functionName == RPSContractMethods.PLAYER2TIMEOUT)
              setEndGameMassage(`endGame-${contractAddress}`, `Player 2 timed out. Player 1 is the winner by default.`)
        }
        else if(tx.from == String(player2).toLowerCase()){
          const functionData = decodeFunctionData({abi: RPSContractABI, data: tx.input});
          if(functionData.functionName == RPSContractMethods.PLAYER1TIMEOUT)
              setEndGameMassage(`endGame-${contractAddress}`, `Player 1 timed out. Player 2 is the winner by default.`)
        }
    })
}

  useWatchBlocks({
    includeTransactions: true,
    enabled: enabledWatchBlock,
    emitOnBegin: true,

    onBlock: processBlock,
  })


  return (
      <AppContainer>
        {endGameMessage? (
        <GameEnd message = {endGameMessage}/>
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
            refetch ={refetchPlayer2Move}
            setSuccessMessage ={ setSuccessMessage}
            setWatchBlock = {setWatchBlock}
            setEndGameMassage = {setEndGameMassage}
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
            refetch = {refetchPlayer2Move}
            setWatchBlock = {setWatchBlock}
            setEndGameMassage = {setEndGameMassage}
          />
        ) : null}
        {error && <ErrorPrompt>{error}</ErrorPrompt>}
        {success && <SuccessPrompt>{success}</SuccessPrompt>}
      </AppContainer>
  );
}
export default GameSession;