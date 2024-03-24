'use client';
import ConnectButton from "@/components/shared/sharedButton"
import { useAccount } from "wagmi"
import StartGame from "./battleSetup";
import { AppContainer } from "@/components/battleSetup.styles";


export default function Home (){

    const { address} = useAccount();
    
    return (<>
        <AppContainer>
        <ConnectButton></ConnectButton>
        {
            address? <StartGame/>: <div>connect to wallet</div>
        }
        </AppContainer>
        </>
    )
}