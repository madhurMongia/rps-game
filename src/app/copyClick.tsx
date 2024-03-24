import React from 'react';
import styled from 'styled-components';

const StyledSubtitle = styled.h2`
  color: #fff;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 10px 20px;
  background-color: #343a40; /* Dark background color */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #495057; /* Slightly darker background on hover */
  }
`;

const CopyOnClick = ({ text, value }: any) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
      .then(() => {
        alert(`Salt copied to clipboard!`);
      })
      .catch((error) => {
        console.error('Error copying salt to clipboard');
      });
  };

  return (
    <StyledSubtitle onClick={handleCopy}>
      {text}
    </StyledSubtitle>
  );
};

export default CopyOnClick;
