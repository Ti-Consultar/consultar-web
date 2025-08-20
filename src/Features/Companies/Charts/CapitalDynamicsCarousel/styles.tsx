import styled from "styled-components";

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--neutral-300);
  padding: 16px;
  position: relative;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 8px;
  color: #555;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }

  &:first-of-type {
    left: 8px;
  }
  &:last-of-type {
    right: 8px;
  }
`;

export const Indicators = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 45px;
  gap: 6px;
`;

export const Dot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#2f6bbd" : "#ccc")};
  cursor: pointer;
  transition: background 0.2s;
`;
