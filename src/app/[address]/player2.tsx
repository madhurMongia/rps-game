import { Label, Title } from "@/components/battleSetup.styles";
import { Button, InputField } from "@/components/shared";
import { MOVES, RPSContractMethods } from "@/constants";
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { decodeFunctionData, formatEther,parseTransaction  } from "viem";
import { useWaitForTransactionReceipt, useWriteContract ,useConnectors, useWatchBlocks} from "wagmi";
import { useEffect, useRef, useState } from "react";
import { Card, InfoText, StatusText, Countdown } from "./gameSession.styles";
import { WeaponSelectorSelect } from "@/components/weaponSelector.styles";
import { getWinner } from "@/utils";

export function Player2Session({
  stake,
  player1,
  player2,
  gameStatus,
  minutes,
  seconds,
  contractAddress,
  player2Move,
  showClaimButton,
  setShowClaimButton,
  writeContract,
  TransactionData,
  setSuccessMessage,
  setError,
  refetch,
  setWatchBlock,
  setEndGameMassage
}: any) {

    const [selectedOption,setSelectedOption] = useState<number>(0);
  

  const handleSelectChange = (e:any) => {
    setSelectedOption(e.target.value);
  }
  const claimTimeoutHandler = async () => {
      writeContract({
        abi: RPSContractABI,
        address: contractAddress,
        functionName : RPSContractMethods.PLAYER1TIMEOUT,
      });
      setShowClaimButton(false);
  };

  const playGameHandler = async () => {
    if(selectedOption)
    writeContract({
      abi: RPSContractABI,
      address: contractAddress,
      functionName : RPSContractMethods.PLAY,
      args: [selectedOption],
      value :stake
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed,error : TransactionError} = 
    useWaitForTransactionReceipt({ 
      hash:TransactionData,
    }) 

    useEffect(() => {
        let timeoutId: NodeJS.Timeout ;
        if(isConfirming){
            setSuccessMessage('Confirming transaction...')
        }
        if (isConfirmed) {
          setSuccessMessage('Transaction confirmed.')
            timeoutId = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            refetch();
          }
          if(TransactionError){
            setError(TransactionError.message)
          }
      }, [isConfirmed, isConfirming,TransactionError]);

    useEffect(()=> {
        if(player2Move)
        setWatchBlock(true); 
    },[player2Move])
  return (
    <Card>
      <Title>Game Status</Title>
      <InfoText>Amount Staked: {formatEther(stake)} ETH</InfoText>
      <InfoText>Challenger: {player1}</InfoText>
      <InfoText>Defender: {player2}</InfoText>
      <Countdown>
        {`${minutes}: ${seconds}`}
      </Countdown>  
    {player2Move ? 
    <InfoText>Your Move : {MOVES[player2Move]}</InfoText> : 
    <>
    <Label htmlFor="weapon-selector" className="visually-hidden">
        Select your weapon
      </Label>
      <WeaponSelectorSelect
        id="weapon-selector"
        value={selectedOption || ''}
        onChange={handleSelectChange}
      >
        {MOVES.map((move, i) => (
          <option key={i} value={i || ""} disabled = {!i}>
            {move}
          </option>
        ))}
      </WeaponSelectorSelect>
      </>}
          <Button onClick={claimTimeoutHandler} disabled = {!(showClaimButton && player2Move)}>Claim Timeout</Button>
          <Button onClick={playGameHandler} disabled = {selectedOption  === 0|| isConfirming || player2Move}>Play</Button>
    </Card>
  );
}
