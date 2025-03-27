import styled from "styled-components";

export const MainContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

export const Title = styled.h2`
  color: var(--neutral-black);
  font-size: 42px;
  font-weight: var(--fontWeightExtraBold);
  line-height: 60px;
  margin: 48px 0 16px;

  @media (max-width: 1180px) {
    margin-top: 36px;
  }
`;

export const Subtitle = styled.p`
  color: var(--text-purple-light);
  font-size: 20px;
  font-weight: var(--fontWeightMedium);
  line-height: 30px;
  margin-bottom: 36px;
  text-align: center;
  max-width: 1180px;

  @media (max-width: 1180px) {
    font-size: 16px;
    line-height: 18.75px;
    padding: 0 16px;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 36px;

  @media (max-width: 1180px) {
    flex-direction: column;
    padding: 16px;
    width: 100%;
  }
`;

export const InfoCard = styled.div`
  background-color: var(--neutral-white);
  border: 1px solid var(--gray);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 350px;
  padding: 22px 24px;
  .icon {
    height: 36px;
    margin-bottom: 13px;
    width: 36px;
  }

  .title {
    color: var(--text-purple-dark);
    line-height: 28px;
    margin-bottom: 16px;
  }

  .text {
    color: var(--text-purple-light);
    max-width: 215px;
  }

  @media (max-width: 1180px) {
    flex: 1;
    height: fit-content;
    min-height: 177px;

    flex-grow: 1;
    width: 100%;

    .title {
      width: 100%;
    }

    .text {
      max-width: 100%;
    }
  }

  @media (max-width: 660px) {
    min-height: 188.5px;
  }

  @media (max-width: 480px) {
    min-height: 221.5px;
  }
`;

export const BenefitsContainer = styled.div`
  align-items: center;
  background-color: var(--neutral-white);
  border: 1px solid var(--gray);
  border-radius: 20px;
  display: flex;
  gap: 40px;
  justify-content: space-between;
  margin: 48px 0;
  padding: 40px;
`;

export const BenefictsText = styled.h4`
  font-size: 24px;
  font-weight: var(--fontWeightExtraBold);
  line-height: 46px;
  letter-spacing: -0.03em;
  max-width: 280px;
  text-align: left;
`;

export const CheckmarksList = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  max-width: 728px;
`;

export const CheckmarkItem = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  max-width: 226px;

  img {
    background-color: var(--neutral-200);
    border-radius: 5px;
    padding: 18px 15px;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 18.75px;
    letter-spacing: -0.02em;
    text-align: left;
  }
`;
