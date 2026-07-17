import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
`;

export const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
  }
`;
