import styled from "styled-components";
import homeBackgroundImg from "../../../assets/images/background-image.png";

export const MainContainer = styled.div`
  position: relative;
  z-index: 1; /* agora isso será respeitado */
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 609px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1180px) {
    padding: 0;
  }
`;

export const BluredBackground = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
`;

export const BlurLayer = styled.div`
  background-image: url(${homeBackgroundImg});
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(80px);
  z-index: 0;
  background-size: cover;
`;

export const Background = styled.div`
  background: rgba(255, 255, 255, 0.1);
  filter: blur(16px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

export const TopBar = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto 16px;
  padding: 16px 24px;
  width: 100%;

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
    color: var(--neutral-800);
    font-size: 56px;
    font-weight: var(--fontWeightBold);
    line-height: 67.2px;
    text-align: center;
  }

  p {
    color: var(--neutral-500);
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
