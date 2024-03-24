import styled from 'styled-components';

export const ErrorPrompt = styled.div`
  position: fixed;
  bottom: 24px; /* Adjust the distance from the bottom as needed */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 13px 19px;
  color: #fff;
  font: 16px/150% Roboto, sans-serif;
  text-align: center;
  background-color: #d32f2f;
  border: none;
  border-radius: 4px;
`;

export const SuccessPrompt = styled.div`
  position: fixed;
  bottom: 24px; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 30vw; 
  padding: 13px 19px;
  color: #fff;
  font: 16px/150% Roboto, sans-serif;
  text-align: center;
  background-color: #43a047;
  border: none;
  border-radius: 4px;
`;
