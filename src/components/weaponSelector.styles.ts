import styled from "styled-components";

export const ChooseWeaponText = styled.p`
  font-family: Roboto, sans-serif;
  line-height: 143%;
  margin-top: 47px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

export const WeaponSelectorWrapper = styled.div`
  margin-top: 10px;
`;

export const WeaponSelectorSelect = styled.select`
  wdisplay: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  margin-top: 10px;
  padding: 12px 13px;
  color: #b2b2b2;
  font: 400 16px Roboto, sans-serif;
  background-color: #374151;
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 991px) {
    padding-right: 20px;
  }
`;