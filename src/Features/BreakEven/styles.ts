import styled, { css, keyframes } from "styled-components";

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 95, 155, 0.3); }
  55% { transform: scale(1.015); box-shadow: 0 0 0 8px rgba(58, 95, 155, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 95, 155, 0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin: 1.5rem;

  @media (max-width: 767px) {
    margin: 0;
    padding: 0.75rem;
  }
`;

export const PageSurface = styled.section`
  min-width: 0;
  padding: 1.25rem;
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  background: var(--neutral-white);

  @media (max-width: 767px) {
    padding: 0.8rem;
  }
`;

export const PageTitle = styled.h1`
  margin-bottom: 1rem;
  color: var(--neutral-700);
  font-size: 1.35rem;
  font-weight: var(--fontWeightBold);
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  > * {
    flex: 0 0 auto;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 58px;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--neutral-200);
  border-bottom: 0;
  border-radius: 9px 9px 0 0;
  background: var(--neutral-50);

  @media (max-width: 760px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const FactorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 40px;
  padding: 0.3rem 0.45rem 0.3rem 0.7rem;
  border: 1px solid rgba(58, 95, 155, 0.28);
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(58, 95, 155, 0.1),
    rgba(58, 95, 155, 0.045)
  );
  color: var(--branding-dark-blue);
  font-size: 0.88rem;
  font-weight: var(--fontWeightSemiBold);
`;

export const FactorHelpButton = styled.button`
  display: inline-grid;
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--branding-default-blue);
  cursor: help;
  place-items: center;

  svg {
    font-size: 17px;
  }

  &:hover {
    background: rgba(58, 95, 155, 0.1);
  }

  &:focus-visible {
    outline: 2px solid rgba(58, 95, 155, 0.55);
    outline-offset: 1px;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{
  $primary?: boolean;
  $dirty?: boolean;
  $spinning?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 36px;
  padding: 0.5rem 0.85rem;
  border: 0;
  border-radius: 8px;
  background: ${({ $primary }) =>
    $primary ? "var(--branding-default-blue)" : "var(--neutral-200)"};
  color: ${({ $primary }) =>
    $primary ? "var(--neutral-white)" : "var(--neutral-700)"};
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: var(--fontWeightSemiBold);
  transition: background 160ms ease, box-shadow 160ms ease, opacity 160ms ease;

  ${({ $dirty }) =>
    $dirty &&
    css`
      animation: ${pulse} 650ms ease-out 1;
      box-shadow: 0 4px 14px rgba(58, 95, 155, 0.25);
    `}

  svg {
    font-size: 1rem;
    ${({ $spinning }) =>
      $spinning &&
      css`
        animation: ${spin} 800ms linear infinite;
      `}
  }

  &:hover:not(:disabled) {
    background: ${({ $primary }) =>
      $primary ? "var(--branding-dark-blue)" : "var(--neutral-300)"};
  }

  &:focus-visible {
    outline: 2px solid var(--branding-default-blue);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.58;
  }
`;

export const TableFrame = styled.div`
  width: 100%;
  max-height: calc(100vh - 330px);
  min-height: 280px;
  overflow: auto;
  border: 1px solid var(--neutral-200);
  border-radius: 0 0 9px 9px;
`;

export const FinancialTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--neutral-800);
  font-size: 0.84rem;
  font-variant-numeric: tabular-nums;

  th,
  td {
    height: 38px;
    padding: 0.42rem 0.75rem;
    border-bottom: 1px solid var(--neutral-200);
  }

  th {
    position: sticky;
    top: 0;
    z-index: 4;
    background: #eef1f5;
    color: var(--neutral-600);
    font-size: 0.72rem;
    font-weight: var(--fontWeightBold);
    letter-spacing: 0.045em;
    text-align: right;
    text-transform: uppercase;
  }

  th:first-child {
    left: 0;
    z-index: 6;
    width: 52%;
    min-width: 390px;
    text-align: left;
  }

  th:nth-child(2) {
    width: 15%;
    min-width: 150px;
  }

  th:nth-child(3),
  th:nth-child(4) {
    width: 16.5%;
    min-width: 180px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    border-left: 2px solid rgba(58, 95, 155, 0.24);
  }

  th:nth-child(4) {
    border-left-color: rgba(58, 95, 155, 0.38);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const TableRow = styled.tr<{ $rowType: string }>`
  background: ${({ $rowType }) =>
    $rowType === "section" ? "#f6f7f9" : "var(--neutral-white)"};

  &:hover td {
    background-color: ${({ $rowType }) =>
      $rowType === "section" ? "#f0f2f5" : "#fafbfc"};
  }

  ${({ $rowType }) =>
    $rowType === "subtotal" &&
    css`
      td {
        border-top: 1px solid var(--neutral-400);
        font-weight: var(--fontWeightBold);
      }
    `}

  ${({ $rowType }) =>
    $rowType === "percentage" &&
    css`
      color: var(--neutral-500);
      font-size: 0.8rem;
    `}
`;

export const DreCell = styled.td<{ $level: number; $emphasized: boolean }>`
  position: sticky;
  left: 0;
  z-index: 2;
  padding-left: ${({ $level }) => `calc(0.75rem + ${$level} * 1.15rem)`} !important;
  background: inherit;
  font-weight: ${({ $emphasized }) =>
    $emphasized ? "var(--fontWeightBold)" : "var(--fontWeightRegular)"};
  white-space: nowrap;
`;

export const NumericCell = styled.td<{ $dimmed?: boolean }>`
  text-align: right;
  white-space: nowrap;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.6 : 1)};
  filter: ${({ $dimmed }) => ($dimmed ? "grayscale(20%)" : "none")};
  transition: opacity 180ms ease, filter 180ms ease;
`;

export const EditableCellShell = styled.div<{
  $compact?: boolean;
  $highlighted?: boolean;
}>`
  position: relative;
  width: ${({ $compact }) => ($compact ? "118px" : "100%")};
  margin-left: auto;

  &::after {
    content: "%";
    position: absolute;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
    color: ${({ $highlighted }) =>
      $highlighted ? "var(--branding-default-blue)" : "var(--neutral-500)"};
    font: inherit;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }
`;

export const EditableCellInput = styled.input<{
  $invalid: boolean;
  $highlighted?: boolean;
}>`
  width: 100%;
  min-height: 30px;
  padding: 0.2rem 1.35rem 0.2rem 0.35rem;
  border: 0;
  border-radius: 4px;
  outline: 0;
  background: ${({ $highlighted }) =>
    $highlighted ? "rgba(58, 95, 155, 0.085)" : "transparent"};
  color: ${({ $invalid, $highlighted }) =>
    $invalid
      ? "var(--status-error-950)"
      : $highlighted
        ? "var(--branding-dark-blue)"
        : "inherit"};
  caret-color: var(--branding-default-blue);
  cursor: text;
  font: inherit;
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $highlighted }) =>
    $highlighted ? "var(--fontWeightSemiBold)" : "inherit"};
  text-align: right;

  &:hover {
    background: rgba(58, 95, 155, 0.055);
  }

  &:focus {
    background: #fff;
    box-shadow: inset 0 0 0 1.5px
      ${({ $invalid }) =>
        $invalid ? "var(--status-error-950)" : "var(--branding-default-blue)"};
  }

  ${({ $invalid }) =>
    $invalid &&
    css`
      box-shadow: inset 0 -2px 0 var(--status-error-950);
    `}
`;

export const EmptyState = styled.div`
  display: grid;
  min-height: 280px;
  place-items: center;
  padding: 2rem;
  color: var(--neutral-500);
  text-align: center;
`;
