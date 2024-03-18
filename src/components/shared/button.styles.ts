import styled from "styled-components";

export const Button = styled.button`
  align-self: center;
  margin-top: 24px;
  padding: 13px 19px;
  color: #fff;
  font: 16px/150% Roboto, sans-serif;
  text-align: center;
  background-color: #16a34a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;