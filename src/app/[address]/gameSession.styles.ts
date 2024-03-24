import styled from "styled-components";

export const Card = styled.div`
  background: rgba(31, 41, 55, 1);
  width: 40vw;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  font-family: 'Roboto', sans-serif;
  text-align: center;
`;

export const InfoText = styled.p`
  font-size: 1.125rem;
  color: #9ca3af;
  margin-bottom: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusText = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #fbbf24;
  text-align: center;
  margin-top: 2rem;
`;

export const Countdown = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #10b981;
  text-align: center;
  margin-top: 1.5rem;
`;