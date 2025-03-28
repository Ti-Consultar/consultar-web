import styled from "styled-components";

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  position: fixed; /* Para garantir que o loading ocupe toda a tela */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3); /* Fundo transparente para o efeito de blur */
  backdrop-filter: blur(10px); /* Aplica o efeito de desfoque */
  z-index: 9999; /* Garante que o loading fique acima de outros elementos */
`;
