import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  background: var(--neutral-100);
  border-radius: 8px;
  padding: 6px 10px;
`;

export const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  width: 200px;
  color: var(--neutral-800);

  &::placeholder {
    color: var(--neutral-400);
  }
`;

export const Filters = styled.div`
  display: flex;
  gap: 6px;
`;

export const FilterButton = styled.button<{ active: boolean }>`
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;

  font-size: 13px;
  font-weight: var(--fontWeightMedium);

  background: ${({ active }) =>
    active ? "var(--neutral-150)" : "transparent"};

  color: ${({ active }) =>
    active ? "var(--branding-default-blue)" : "var(--neutral-500)"};

  transition: all 0.2s ease;

  &:hover {
    background: var(--neutral-150);
  }
`;

export const Count = styled.span`
  font-size: 14px;
  color: var(--neutral-500);
`;

export const ViewSwitcher = styled.div`
  display: flex;
  background: var(--neutral-100);
  border-radius: 8px;
  padding: 4px;
`;

export const IconButton = styled.button<{ active: boolean }>`
  border: none;
  background: ${({ active }) =>
    active ? "var(--neutral-150)" : "transparent"};

  border-radius: 6px;
  padding: 6px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ active }) =>
    active ? "var(--branding-default-blue)" : "var(--neutral-500)"};

  transition: all 0.2s ease;

  &:hover {
    background: var(--neutral-150);
  }
`;

export const AddButton = styled.button`
  background: var(--button-primary);
  color: var(--neutral-white);

  border: none;
  border-radius: 8px;
  padding: 8px 14px;

  font-size: 14px;
  font-weight: var(--fontWeightMedium);
  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: var(--button-primary-hover);
  }
`;
