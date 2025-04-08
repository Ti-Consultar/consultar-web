import styled from "styled-components";

export const Loader = styled.div`
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  animation: l14 4s infinite;
  margin-bottom: 10px;

  &::before,
  &::after {    
    content: "";
    grid-area: 1/1;
    border: 8px solid;
    border-radius: 50%;
    border-color: #94191D #94191D #0000 #0000;
    mix-blend-mode: darken;
    animation: l14 1s infinite linear;
  }

  &::after {
    border-color: #0000 #0000 #3A5F9B #3A5F9B;
    animation-direction: reverse;
  }

  @keyframes l14 { 
    100% { transform: rotate(1turn); }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.16);
  z-index: 9999; 
`;

export const Text = styled.span`
  color: var(--neutral-800);
  font-size: 16px;
`

export const LoadingContentContainer = styled.div`
  display: flex;
  width: 300px;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px
`
