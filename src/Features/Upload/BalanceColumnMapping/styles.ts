import styled from "styled-components";

export const Title = styled.h2`
  font-size: 24px;
  color: var(--neutral-700);
`;

export const Title2 = styled.p`
  font-size: 18px;
  color: var(--neutral-700);
  margin-bottom: 1rem;
`;

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

export const SpreadsheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 80vh;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--neutral-300);
  padding: 16px;
  position: relative;
  margin-bottom: 1.5rem;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 80vh;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--neutral-300);
  padding: 16px;
  position: relative;
  margin-bottom: 1.5rem;
`;
