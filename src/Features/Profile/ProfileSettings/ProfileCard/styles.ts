import styled from "styled-components";

export const ProfileCardContainer = styled.div`
  display: flex;
  border-radius: 15px;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid var(--neutral-300);
  background-color: var(--neutral-white);
`;

export const Container = styled.div`
  display: flex;
  width: auto;
  align-items: center;
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ProfilePic = styled.div`
    align-items: center;
    background-color: var(--neutral-800);
    border-radius: 80px;
    display: flex;
    height: 80px;
    width: 80px;
    margin-right: 1rem;
    justify-content: center;
    margin-right: "16px";

    p {
      font-size: 28px;
      color: var(--neutral-white);
      font-weight: var(--fontWeightBold);
    }
  }
`;

export const NameText = styled.span`
  font-size: 20px;
  font-weight: var(--fontWeightSemiBold);
  color: var(--neutral-700);
`;

export const Info = styled.span`
  font-size: 18px;
  font-weight: var(--fontWeightSemiBold);
  color: var(--neutral-500);
`;
