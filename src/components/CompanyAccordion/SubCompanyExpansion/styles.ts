import styled from 'styled-components';

export const SubCompaniesContainer = styled.div`
  margin: 0px 40px 15px;
  border-radius: 0px 0px 8px 8px;
  display: flex;
  flex-direction: column;
  height: auto;
  background-color: #c0d5ff;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  padding: 10px;
`;

export const SubCompanyContainer = styled.div`
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 12px;
  border-radius: 4px;
  border-bottom: 1px solid rgb(152, 152, 152);
  cursor: pointer;
      &:hover {
    background-color:rgb(155, 179, 223);
  }
`

export const Text = styled.p`
  font-size: 16px;
  font-weight: var(--fontWeightSemiBold);
`
