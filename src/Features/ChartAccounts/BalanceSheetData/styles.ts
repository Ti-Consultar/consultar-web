import styled from "styled-components";

export const ViewerContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100% - 2rem);
  min-height: 560px;
  margin: 1rem 1.25rem;
  overflow: hidden;
  background: var(--neutral-white);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;

  @media (max-width: 767px) {
    height: calc(100% - 1rem);
    min-height: 520px;
    margin: 0.5rem;
  }
`;

export const ViewerHeader = styled.header`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--neutral-200);
`;

export const HeaderContent = styled.div`
  min-width: 0;
  flex: 1;
`;

export const Title = styled.h1`
  color: var(--neutral-700);
  font-size: 1.2rem;
  font-weight: var(--fontWeightSemiBold);
  line-height: 1.4;
`;

export const Metadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  margin-top: 0.2rem;
  color: var(--neutral-500);
  font-size: 0.82rem;

  span + span::before {
    content: "•";
    margin-right: 0.75rem;
    color: var(--neutral-300);
  }
`;

export const FilterBar = styled.section`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--neutral-200);
  background: var(--neutral-100);
`;

export const FilterGroup = styled.div<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: ${({ $wide }) => ($wide ? "min(320px, 100%)" : "auto")};
  min-width: 0;
`;

export const FilterGroupLabel = styled.span`
  color: var(--neutral-600);
  font-size: 0.72rem;
  font-weight: var(--fontWeightSemiBold);
  line-height: 1;
  letter-spacing: 0.02em;
`;

export const FilterHelper = styled.span`
  color: var(--neutral-400);
  font-size: 0.68rem;
  line-height: 1.2;
`;

export const DegreeSelector = styled.div`
  display: inline-flex;
  height: 40px;

  .MuiToggleButton-root {
    min-width: 40px;
    padding: 0 0.75rem;
    border-color: var(--neutral-300);
    border-radius: 0;
    color: var(--neutral-600);
    background: var(--neutral-white);
  }

  .MuiToggleButton-root + .MuiToggleButton-root {
    margin-left: -1px;
  }

  .MuiToggleButton-root:first-child {
    border-radius: 8px 0 0 8px;
  }

  .MuiToggleButton-root:last-child {
    border-radius: 0 8px 8px 0;
  }

  .MuiToggleButton-root.Mui-selected {
    z-index: 1;
    border-color: var(--branding-default-blue);
    color: var(--branding-default-blue);
    background: rgba(58, 95, 155, 0.1);
  }

  .MuiToggleButton-root.Mui-selected:hover {
    background: rgba(58, 95, 155, 0.16);
  }
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 1rem 0 0 auto;

  @media (max-width: 900px) {
    width: 100%;
    margin-left: 0;
    margin-top: 0.25rem;
  }
`;

export const CountBar = styled.div`
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 1rem;
  color: var(--neutral-500);
  font-size: 0.8rem;
  border-bottom: 1px solid var(--neutral-200);
`;

export const LoadingLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

export const LoadingDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--branding-default-blue);
  animation: viewer-pulse 1s ease-in-out infinite alternate;

  @keyframes viewer-pulse {
    from {
      opacity: 0.35;
    }
    to {
      opacity: 1;
    }
  }
`;

export const GridContainer = styled.section`
  position: relative;
  flex: 1;
  min-height: 0;

  .ag-root-wrapper {
    border: 0;
  }

  .ag-cell {
    display: flex;
    align-items: center;
  }

  .trial-balance-number {
    justify-content: flex-end;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .trial-balance-parent-description {
    color: var(--neutral-700);
    font-weight: var(--fontWeightSemiBold);
  }

  .trial-balance-final {
    color: var(--neutral-700);
    font-weight: var(--fontWeightSemiBold);
    background: rgba(58, 95, 155, 0.035);
  }
`;

export const StateOverlay = styled.div`
  position: absolute;
  z-index: 4;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.96);
  color: var(--neutral-500);

  h2 {
    color: var(--neutral-700);
    font-size: 1rem;
    font-weight: var(--fontWeightSemiBold);
  }

  p {
    max-width: 440px;
    font-size: 0.875rem;
  }
`;
