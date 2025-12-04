// src/pages/NotFoundPage/index.tsx
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Chip } from "@mui/material";
import { styled } from "styled-components";
import { MainTemplate } from "../../components/AppLayout";
import NotFoundIcon from "../../assets/images/consultar-404.png";

const Container = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  background-color: #fafafa;
`;

const Illustration = styled.img`
  margin-bottom: 20px;
  width: 280px;
`;

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <MainTemplate>
      <Container>
        <Illustration
          src={NotFoundIcon}
          alt="Página não encontrada"
          draggable={false}
        />
        <Chip label="404 NOT_FOUND" color="error" variant="outlined"></Chip>

        <Typography variant="h4" fontWeight={700} mb={1}>
          Página não encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          A rota que você tentou acessar não existe ou foi movida. Verifique o
          caminho e tente novamente.
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Se você acredita que isso é um erro, entre em contato com o suporte.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", borderRadius: "8px", backgroundColor: "var(--neutral-700)" }}
        >
          Voltar ao site
        </Button>
      </Container>
    </MainTemplate>
  );
};

export default NotFoundPage;
