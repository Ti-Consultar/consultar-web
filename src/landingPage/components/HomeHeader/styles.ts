import styled from 'styled-components';
import homeBackgroundImg from '../../../assets/images/graphic-background.png';

export const MainContainer = styled.div`
  align-items: center;
  background-image: url(${homeBackgroundImg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 609px;
  margin: 0 auto;
  padding: 24px 0;
  width: 100%;

  @media (max-width: 1180px) {
    padding: 0;
  }
`;

export const TopBar = styled.div`
  align-items: center;
  background-color: var(--neutral-50);
  display: flex;
  justify-content: space-between;
  border-radius: 360px;
  margin: 0 auto 16px;
  padding: 16px 24px;
  width: 1128px;

  @media (max-width: 1180px) {
    border-radius: 0;
    margin: 0;
    padding: 16px;
    width: 100%;

    img {
      width: 120px;
    }
  }
`;

export const ContentContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
  max-width: 738px;

  h2 {
    color: var(--neutral-white);
    font-size: 56px;
    font-weight: var(--fontWeightBold);
    line-height: 67.2px;
    text-align: center;
  }

  p {
    color: var(--neutral-white);
    font-size: 18px;
    font-weight: var(--fontWeightRegular);
    line-height: 27px;
    text-align: center;
  }

  @media (max-width: 760px) {
    padding: 0 16px;
  }

  @media (max-width: 600px) {
    margin-bottom: 24px;

    h2 {
      font-size: 40px;
      line-height: 48px;
    }

    p {
      font-size: 16px;
      line-height: 23px;
    }
  }
`;

export const NavButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
