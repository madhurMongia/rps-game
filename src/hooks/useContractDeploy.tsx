import {useState } from 'react';
import { wagmiConfig } from '@/blockchain/config.ts';
import { deployContract as viemDeployContract, waitForTransactionReceipt } from 'viem/actions';
import { getConnectorClient } from '@wagmi/core';
 
export const useContractDeploy = (params: any) => {
  const { abi, address, bytecode, args, value } = params;
  
  const [deployedContractAddress, setDeployedContractAddress] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState(null);

  const deployContract = async () => {
    setIsDeploying(true);
    setError(null);
    const walletClient = await getConnectorClient(wagmiConfig);
    try {
      
      const deploymentHash = await viemDeployContract(walletClient, {
        abi,
        account: address,
        bytecode,
        value,
        args,
      });

      const transaction = await waitForTransactionReceipt(walletClient,
        { hash: deploymentHash }
      )

      const contractAddress = transaction.contractAddress;

      setDeployedContractAddress(contractAddress);
    } catch (err: any) {
      setError(err?.details || err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  return { deployContract, deployedContractAddress, isDeploying, error };
};

export default useContractDeploy;