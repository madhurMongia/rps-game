import styled from "styled-components";

export const AppContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #111827;
  color: #d1d5db;
  font-weight: 700;
  margin: 0;
  font-size: 14px;
`;

export const BattleSetupWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  max-width: 100%;
  margin-top: 28px;
  padding: 37px 64px 79px;
  background-color: #1f2937;
  border-radius: 12px;
  box-shadow: 0px 20px 25px -5px rgba(0, 0, 0, 0.1),
    0px 8px 10px -6px rgba(0, 0, 0, 0.1);

  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

export const Title = styled.h1`
  color: #22c55e;
  text-align: center;
  font-family: Roboto, sans-serif;
  font-weight: 600;
  line-height: 143%;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  alignself: center;
`;

export const Subtitle = styled.h2`
  color: #fff;
  text-align: center;
  align-self: center;
  margin-top: 23px;
  font: 500 18px Roboto, sans-serif;
`;
export const Label = styled.label`
  font-family: Roboto, sans-serif;
  line-height: 143%;
  margin-top: 30px;
  color: #9ca3af;
  font-size: 14px;
`;