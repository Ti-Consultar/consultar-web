import styled from "styled-components";

interface StepCircleProps {
  active: boolean;
}

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const FormContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

export const StepperContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

export const StepCircle = styled.div<StepCircleProps>`
  width: ${({ active }) => (active ? "12px" : "8px")};
  height: ${({ active }) => (active ? "12px" : "8px")};
  border-radius: 50%;
  background-color: ${({ active }) => (active ? "var(--neutral-800)" : "#ccc")};
  transition: all 0.3s ease;
`;
