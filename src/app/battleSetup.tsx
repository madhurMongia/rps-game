import { RPSByteCode } from "@/blockchain/bytecode";
import useContractDeploy from "@/hooks/useContractDeploy";
import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import rpsContractABI from '@/blockchain/ABIs/RPS.json';
import { hashMove } from "@/utils";
import { useLocalStorage } from "@/hooks";
import { parseEther } from "viem";
import {
  BattleSetupWrapper, Title,
  Subtitle, Label,
} from "@/components/battleSetup.styles";
import { Button } from '@/components/shared/button.styles'
import { InputField } from "@/components/shared/Input.styles";
import { WeaponSelectorSelect } from "@/components/shared/weaponSelector.styles";
import { MOVES } from "@/constants";
import { ErrorPrompt } from "@/components/shared/error.styles";

export default function StartGame()  {
    const { address } = useAccount();
    const [c1, setc1] = useState('');
    const [j2, setJ2] = useState('');
    const [stake, setStake] = useState(0);
    const [_,StoredSalt,updateStoredSalt] = useLocalStorage(`salt`, BigInt(0));
    const _salt = useRef<bigint>(BigInt(0));
    const { deployContract, deployedContractAddress, isDeploying, error } = useContractDeploy({
      abi: rpsContractABI,
      bytecode: RPSByteCode,
      args: [c1, j2],
      value: parseEther(String(stake)),
      address,
    });

    const handleMoveHash=(e: any) => {
        const {hashedMove , salt:saltUsed} = hashMove(Number(e.target.value) -1);
        _salt.current = saltUsed;
        setc1(hashedMove)
    }

    const handleDeploy = async () => {
      await deployContract();
    };
    useEffect(() => {
        updateStoredSalt(`salt-${deployedContractAddress}`,_salt.current)
    }, [deployedContractAddress])
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
        value={c1}
        onChange={handleMoveHash}
      >
        <option value="" disabled>
          Select move
        </option>
        {MOVES.map((move, i) => (
          <option key={move} value={i}>
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
            <Label htmlFor="opponent-id">Opponent's ID</Label>
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
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
               />
            <Button onClick={handleDeploy} disabled={!c1 || !j2 || !stake || isDeploying}
            >{isDeploying ? 'Preparing Battlefield...' : 'Engage Battle' }
            </Button>
            {deployedContractAddress && (
          <Subtitle>
          <a href={`/${deployedContractAddress}`}>
          Navigate to Battlefield
            </a>
          </Subtitle>
        )}
          </BattleSetupWrapper>
          {error && <ErrorPrompt>{error}</ErrorPrompt>}
          {}
       </>
    );
  };