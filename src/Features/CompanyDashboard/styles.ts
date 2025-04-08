import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 24px 50px;

  @media (max-width: 1195px) {
    padding: 24px;
  }
`;

export const Title = styled.h1`
  color: #224071;
  font-size: 32px;
  font-weight: var(--fontWeightSemiBold);
  line-height: 32px;

    @media (max-width: 720px) {
      font-size: 24px;
  }
`;

export const SubTitle = styled.h2`
  color: #224071;
  font-size: 18px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DashboardContainer = styled.div`
  margin-top: 24px;
  background-color: #fff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.11);
  width: 100%;
`;
