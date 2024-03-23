import { Label, Title } from "@/components/battleSetup.styles";
import { Button, InputField } from "@/components/shared";
import { MOVES, RPSContractMethods } from "@/constants";
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { formatEther } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { Card, InfoText, Countdown } from "./gameSession.styles";
import { useLocalStorage } from "@/hooks";
import { WeaponSelectorSelect } from "@/components/weaponSelector.styles";
import { useEffect, useState } from "react";

export function Player1Session({
  stake,
  player1,
  player2,
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

  const [_,StoredSalt,updateStoredSalt] = useLocalStorage(`salt-${contractAddress}`, undefined);
  const [selectedOption,setSelectedOption] = useState<number | undefined>(undefined);

  const claimTimeoutHandler = async () => {
      writeContract({
        abi: RPSContractABI,
        address: contractAddress,
        functionName : RPSContractMethods.PLAYER2TIMEOUT,
      });
      setShowClaimButton(false);
      alert('Timeout claimed. Player 1 is the winner by default.');
  };

  const solveGameHandler = async () => {
    console.log(selectedOption,StoredSalt)
    if(selectedOption !== undefined && StoredSalt !== undefined)
    writeContract({
      abi: RPSContractABI,
      address: contractAddress,
      functionName : RPSContractMethods.SOLVE,
      args: [selectedOption +1,StoredSalt]
    })
  }

  const handleSelectChange = (e:any) => {
    setSelectedOption(e.target.value);
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash:TransactionData , 
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
      <Title>Game Stats</Title>
      <InfoText>Amount Staked: {formatEther(stake)} ETH</InfoText>
      <InfoText>Challenger: {player1}</InfoText>
      <InfoText>Defender: {player2}</InfoText>
      <Countdown>
        {`${minutes}: ${seconds}`}
      </Countdown> 
    { player2Move && <><Label htmlFor="weapon-selector" className="visually-hidden">
        Reveal Your Move
      </Label><WeaponSelectorSelect
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
        </WeaponSelectorSelect></>}
        {
          !StoredSalt && 
          <><Label htmlFor="stake-amount">Salt</Label><InputField
          id="salt"
          type="string"
          value={String(StoredSalt)}
          onChange={(e) => updateStoredSalt(`salt-${contractAddress}`,e.target.value)} /></>
        }
          <Button onClick={claimTimeoutHandler} disabled = {!showClaimButton || player2Move}>Claim Timeout</Button>
          <Button onClick={solveGameHandler} disabled = {!player2Move || selectedOption == undefined || !StoredSalt || isConfirming}>Solve Game</Button>
    </Card>
  );
}