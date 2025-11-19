import styled from "styled-components";

export const Title = styled.h2`
  font-size: 24px;
  color: var(--neutral-700);
  margin-bottom: 1rem;
`;

export const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* mobile: 1 coluna */
  gap: 20px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; /* tablet+ : 2 colunas */
  }

  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr; /* desktop largo: 3 colunas */
  }
`;

export const ChartCard = styled.div`
  background: #fff;
  border: 1px solid #e4e4e4ff; 
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 300px;
`;
