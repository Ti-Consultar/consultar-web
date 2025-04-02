import styled from "styled-components";

interface MainTemplateStyledProps {
  isExpanded?: boolean;
}

export const MainContainer = styled.div`
  margin: 0px 38px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  height: 5rem;
  border-radius: 8px;
  cursor: pointer;
  justify-content: space-between;
  background-color: var(--branding-default-blue);

  @media (max-width: 1195px) {
    margin: 12px 6px;
  }
`;

export const ContentContainer = styled.div`
  padding: 0px 12px;
  gap: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.div<MainTemplateStyledProps>`
  padding: 0px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: filter 0.2s, transform 0.3s, margin 0.3s;
`;

export const CompanyButton = styled.button`
  background-color: #10B981;
  border-radius: 8px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color:rgb(4, 146, 99);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98); 
  }
`;

export const Title = styled.h1`
  color: var(--neutral-white);
  font-size: 24px;
  font-weight: var(--fontWeightMedium);

  span {
    font-weight: var(--fontWeightRegular);
  }

  @media (max-width: 1195px) {
    font-size: 20px;
    margin-bottom: 0px;
  }
    @media (max-width: 600px) {
    font-size: 18px;
    margin-bottom: 0px;
  }
`;
