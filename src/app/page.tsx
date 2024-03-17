'use client';
import ConnectButton from "@/components/shared/sharedButton"
import { useAccount } from "wagmi"
import StartGame from "./startGame";


export default function Home (){

    const { address} = useAccount();
    
    return <div>
        <ConnectButton></ConnectButton>
        {
            address? <StartGame/>: <div>connect to wallet</div>
        }
    </div>
}