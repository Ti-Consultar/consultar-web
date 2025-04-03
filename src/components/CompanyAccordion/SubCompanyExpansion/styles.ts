import styled from 'styled-components';

export const SubCompaniesContainer = styled.div`
  margin: 0px 40px 0px;
  display: flex;
  flex-direction: column;
  background-color:rgb(224, 224, 224);
  padding: 10px;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.11);
  overflow: hidden;
  transition: all 0.35s;

  @media (max-width: 1195px) {
    margin: 0px 10px 0px;
  }
`;

export const SubCompanyContainer = styled.div`
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 12px;
  margin-top: 6px;
  border-radius: 4px;
  border-bottom: 1px solid rgb(152, 152, 152);
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
    &:hover {
    background-color: rgb(196, 196, 196)
  }
}
`

export const Text = styled.p`
  color: var(--neutral-800);
  font-size: 16px;
  font-weight: var(--fontWeightSemiBold);
`
