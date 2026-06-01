import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  margin: 1.5rem;

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 85%;
  }

  @media (max-width: 767px) {
    padding: 0.7rem;
    margin: 0;
  }
`;

export const HeaderContainer = styled.div`
  background-color: var(--neutral-white);
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
  padding: 1rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const ContentContainer = styled.div`
  background-color: var(--neutral-white);
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
  align-self: center;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 1.5rem;
  padding: 2rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 20px;
  color: var(--neutral-700);
`;

export const Subtitle = styled.span`
  font-size: 16px;
  color: var(--neutral-500);
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h3`
  color: var(--neutral-700);
  font-size: 18px;
  margin: 0 0 0.75rem;
`;

export const HelperText = styled.p`
  color: var(--neutral-500);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 1rem;
`;

export const FormatList = styled.ol`
  color: var(--neutral-600);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding-left: 1.25rem;
`;

export const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultCard = styled.div`
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  padding: 1rem;
`;

export const ResultLabel = styled.span`
  color: var(--neutral-500);
  display: block;
  font-size: 13px;
  margin-bottom: 0.25rem;
`;

export const ResultValue = styled.span`
  font-weight: 600;
  color: var(--neutral-700);
  font-size: 18px;
`;
