import { useReadContract, useSimulateContract } from "wagmi";
import { Card, InfoText } from "./gameSession.styles";
import RPSContractABI from '@/blockchain/ABIs/RPS.json';
import { useEffect } from "react";

const GameEnd = ({contractAddress, player2Move} : any) => {

    const {data } = useSimulateContract({
        abi: RPSContractABI,
        address: contractAddress,
        functionName : 'solve',
    });
    useEffect(() => {
        console.log(data);
    }, [data]);

  return (
    <Card>
        data :{JSON.stringify(data)}
    <InfoText>Game has already Ended Thanks for playing</InfoText>
  </Card>
  );
};

export default GameEnd;