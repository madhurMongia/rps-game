import { Card, InfoText } from "./gameSession.styles";
const GameEnd = ({message}:any) => {


  return (
    <Card >
    <InfoText>{message}</InfoText>
  </Card>
  );
};

export default GameEnd;