import { Label, Title } from "@/components/battleSetup.styles";
import { Button, InputField } from "@/components/shared";
import { MOVES, RPSContractMethods } from "@/constants";
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { formatEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect, useRef, useState } from "react";
import { Card, InfoText, StatusText, Countdown } from "./gameSession.styles";
import { WeaponSelectorSelect } from "@/components/weaponSelector.styles";

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
  setSuccessMessage
}: any) {

    const [selectedOption,setSelectedOption] = useState<number | undefined>(undefined);

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
    if(selectedOption !== undefined)
    writeContract({
      abi: RPSContractABI,
      address: contractAddress,
      functionName : RPSContractMethods.PLAY,
      args: [selectedOption],
      value :stake
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed} = 
    useWaitForTransactionReceipt({ 
      hash:TransactionData,
    }) 

    useEffect(() => {
        let timeoutId: NodeJS.Timeout ;
    
        if(isConfirmed){
            setSuccessMessage('Transaction confirmed.')
        }
        if(isConfirming){
            setSuccessMessage('Confirming transaction...')
        }
        if (isConfirmed || isConfirming ) {
            timeoutId = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
          }
        return () => clearTimeout(timeoutId);
      }, [isConfirmed, isConfirming]);
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
    <InfoText>Your Move : {MOVES[player2Move - 1]}</InfoText> : 
    <>
    <Label htmlFor="weapon-selector" className="visually-hidden">
        Select your weapon
      </Label>
      <WeaponSelectorSelect
        id="weapon-selector"
        value={selectedOption !== undefined? selectedOption: ''}
        onChange={handleSelectChange}
      >
        <option value="" disabled>
          Select move
        </option>
        {MOVES.map((move, i) => (
          <option key={i} value={i}>
            {move}
          </option>
        ))}
      </WeaponSelectorSelect>
      </>}
          <Button onClick={claimTimeoutHandler} disabled = {!showClaimButton}>Claim Timeout</Button>
          <Button onClick={playGameHandler} disabled = {selectedOption == undefined  || isConfirming || player2Move}>Play</Button>
    </Card>
  );
}