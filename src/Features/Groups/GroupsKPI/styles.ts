import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 96px;
  padding: 16px;

  border-radius: 16px;
  border: 1px solid #ebebeb;

  background: #fafaf9;
`;

export const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
`;

export const Value = styled.span`
  margin-top: 8px;

  font-size: 22px;
  font-weight: 400;
  color: #111827;
`;

export const Subtitle = styled.span`
  margin-top: 4px;

  font-size: 12px;
  font-weight: 400;
  color: #9ca3af;
`;

export const DashContainer = styled.div`
  display: grid;
  gap: 16px;

  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
