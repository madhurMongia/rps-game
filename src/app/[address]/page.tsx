'use client';
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import RPSContactAbi from '@/blockchain/ABIs/RPS.json';
import { redirect } from "next/navigation";
import { Player1Session } from "./player1";
import { Player2Session } from "./player2";
export default function GameSession({ params }: { params: { address: any } }) {

    const {address: contractAddress} = params;
    const { address : player } = useAccount();

    const { data: move2 } = useReadContract({
       abi :RPSContactAbi,
        address : contractAddress,
        functionName: 'c2',
      });
    
      const { data: stake } = useReadContract({
         abi :RPSContactAbi,
        address : contractAddress,
        functionName: 'stake',
      });
    
      const { data: player1 } = useReadContract({
         abi :RPSContactAbi,
        address : contractAddress,
        functionName: 'j1',
      });
    
      const { data: last } = useReadContract({
         abi :RPSContactAbi,
        address : contractAddress,
        functionName: 'lastAction',
      });
    
      const { data: TIMEOUT } = useReadContract({
         abi :RPSContactAbi,
        address : contractAddress,
        functionName: 'TIMEOUT',
      });
    
      const { data: player2 } = useReadContract({
        abi :RPSContactAbi,
        address : contractAddress,
        functionName: 'j2',
      });

      const {
        status: claimTimeoutStatus,
        writeContract : claimTimeout,
        data: claimTimeoutTransactionData,
      } = useWriteContract();
    
      console.log({move2, stake, player1, last, TIMEOUT,player2});
      
      if(![player1,player2].includes(player)){
        return redirect('/')
      }
      return (
        <>
        {player1 === player && <Player1Session/>}
        {player2 === player && <Player2Session/>}
        </>
    )
}
