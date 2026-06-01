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
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;
