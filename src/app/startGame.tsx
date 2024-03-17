import { RPSByteCode } from "@/blockchain/bytecode";
import useContractDeploy from "@/hooks/useContractDeploy";
import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import rpsContractABI from '@/blockchain/ABIs/RPS.json';
import { hashMove } from "@/utils";
import { useLocalStorage } from "@/hooks";
import { parseEther } from "viem";

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
      value: parseEther('0.1'),
      address,
    });

    const handleMoveHash=(e: any) => {
        const {hashedMove , salt:saltUsed} = hashMove(Number(e.target.value));
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
      <div>
        <h1>Start a New Game</h1>
        <div>
          <label htmlFor="j1">Player 1 (Your Address):</label>
          <input id="j1" type="text" value={address} disabled />
        </div>
        <div>
          <label htmlFor="c1">Hash Commitment:</label>
          <input
            id="c1"
            type="number"
            onChange={(e) => handleMoveHash(e)}
          />
        </div>
        <div>
          <label htmlFor="j2">Player 2 Address:</label>
          <input
            id="j2"
            type="text"
            value={j2}
            onChange={(e) => setJ2(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stake">Stake (in ETH):</label>
          <input
            id="stake"
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleDeploy} disabled={!c1 || !j2 || !stake || isDeploying}>
          {isDeploying ? 'Deploying...' : 'Deploy Contract'}
        </button>
        {deployedContractAddress && (
          <p>
            Contract deployed at: <a href={`/game/${deployedContractAddress}`}>
              {deployedContractAddress}
            </a>
          </p>
        )}
      </div>
    );
  };