import styled from "styled-components";

export const StyledLink = styled.a`
color: #fff;
text-decoration: none;
font-weight: bold;
font: 400 22px Roboto, sans-serif;
transition: all 0.3s ease; 

  &:hover {
    color: #22c55e;
    text-decoration: underline;
    transform: scale(1.05);
    text-decoration: none;
  }
`;