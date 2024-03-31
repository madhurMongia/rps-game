import { RPSByteCode } from "@/blockchain/bytecode";
import useContractDeploy from "@/hooks/useContractDeploy";
import { useState, useEffect, useRef } from "react";
import { useAccount, useBalance } from "wagmi";
import rpsContractABI from '@/blockchain/ABIs/RPS.json';
import { hashMove } from "@/utils";
import { useLocalStorage } from "@/hooks";
import { Address, parseEther } from "viem";
import {
  BattleSetupWrapper, Title,
  Subtitle, Label,
} from "@/components/battleSetup.styles";
import { WeaponSelectorSelect } from "@/components/weaponSelector.styles";
import { MOVES } from "@/constants";
import { StyledLink,InputField,ErrorPrompt,Button } from "@/components/shared";
import CopyOnClick from "./copyClick";

export default function StartGame()  {
    const { address } = useAccount();
    const {data:balance} = useBalance({
      address
    })
    const [j2, setJ2] = useState<Address | ''>('');
    const [selectedOption,setSelectedOption] = useState<number>(0);
    const [stake, setStake] = useState<string | ''>('');
    const [,storedSalt,updateStoredSalt] = useLocalStorage(`salt`, undefined);
    const [,storedHash,updateStoredHash] = useLocalStorage(`move`, undefined);
    const _salt = useRef<string | undefined>();
    const _encryptedMove = useRef<string |undefined>();
    const { deployContract, deployedContractAddress, isDeploying, error,setError} = useContractDeploy({
      abi: rpsContractABI,
      bytecode: RPSByteCode,
      value: parseEther(stake),
      address,
    });

    const handleSelectChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(Number(event.target.value));
    };
    const handleDeploy = async () => {
      if(balance && parseEther(stake) > balance?.value){
        setError('Staked amount cannot be more than account balance');
        return;
      }
      if(!deployedContractAddress && j2 !== address && selectedOption){
          const {hashedMove , salt:saltUsed,encryptedMove} = await hashMove(selectedOption);
          _salt.current = saltUsed;
          _encryptedMove.current = encryptedMove;
          console.log({hashedMove ,saltUsed})
      await deployContract({args: [hashedMove,j2]});
      }
    };
    useEffect(() => {
        updateStoredSalt(`salt-${deployedContractAddress}`,_salt.current)
        updateStoredHash(`move-${deployedContractAddress}`,_encryptedMove.current)
    }, [deployedContractAddress])
    useEffect(() => {
    }, [selectedOption])
    return (
      <>
          <BattleSetupWrapper>
            <Title>Rock, Paper, Scissors, Lizard, Spock</Title>
            <Subtitle>Challenge an Opponent</Subtitle>
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
            <Label htmlFor="j1">Your Address:</Label>
            <InputField
              id="j1"
              type="text" 
              value={address}
              disabled
              aria-label="Your Address:" />
            <Label htmlFor="opponent-id">Opponent Address</Label>
            <InputField
              id="opponent-id"
              placeholder="Enter opponent's ID"
              onChange = {(e:any) => setJ2(e.target.value)}
              type="text"
              value={j2}
              aria-label="Opponent's ID" />
            <Label htmlFor="stake-amount">Stake Amount</Label>
            <InputField
              id="stake"
              type="number"
              placeholder="Enter stake amount"
              aria-label="Stake Amount"
              value={stake}
              min={0}
              onChange={(e) => setStake(String(e.target.value))}
               />
            <Button onClick={handleDeploy} disabled={ !selectedOption || !j2 || isDeploying || deployedContractAddress !== null }
            >{isDeploying ? 'Preparing Battlefield...' : 'Engage Battle' }
            </Button>
            {deployedContractAddress && (
              <><CopyOnClick text = {`Click here to save the salt, you might need it to reveal the move later`} value = {String(storedSalt)}/>
              <CopyOnClick text = {`Please share the session link with your opponent ,Click me to copy`} value = {`${window.location.href}${deployedContractAddress}`}/>
              <Subtitle>
              <StyledLink href={`/${deployedContractAddress}`}>
                Navigate to Battlefield
              </StyledLink>
            </Subtitle></>
        )}
          </BattleSetupWrapper>
          {error && <ErrorPrompt>{error}</ErrorPrompt>}
          {}
       </>
    );
  };