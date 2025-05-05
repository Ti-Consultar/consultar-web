import styled from "styled-components";

export const Loader = styled.div`
  width: 60px;
  margin: 25px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
  background: 
    var(--_g) 0%   50%,
    var(--_g) 50%  50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 50%;
  animation: l3 1s infinite linear;

@keyframes l3 {
    20%{background-position:0%   0%, 50%  50%,100%  50%}
    40%{background-position:0% 100%, 50%   0%,100%  50%}
    60%{background-position:0%  50%, 50% 100%,100%   0%}
    80%{background-position:0%  50%, 50%  50%,100% 100%}
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
  margin-bottom: 10px;
`;

export const LoadingContentContainer = styled.div`
  display: flex;
  width: 300px;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
`;
