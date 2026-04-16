import { Box, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";

interface Props {
  filter: string;
  search: string;
}

export const GroupsEmptyState = ({ filter, search }: Props) => {
  const isSearching = search.trim().length > 0;

  const getTitle = () => {
    if (isSearching) return "Nenhum resultado encontrado";
    if (filter === "inactive") return "Nenhum grupo inativo";
    if (filter === "active") return "Nenhum grupo ativo";
    return "Nenhum grupo encontrado";
  };

  const getSubtitle = () => {
    if (isSearching) return "Tente ajustar sua busca ou remover filtros.";
    if (filter === "inactive")
      return "Você não possui grupos inativos no momento.";
    if (filter === "active") return "Você ainda não possui grupos ativos.";
    return "Comece criando seu primeiro grupo.";
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      mt={8}
      gap={2}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#F4F6F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ApartmentIcon sx={{ color: "#98A2B3" }} />
      </Box>

      <Typography fontSize={18} fontWeight={600}>
        {getTitle()}
      </Typography>

      <Typography color="text.secondary" maxWidth={300}>
        {getSubtitle()}
      </Typography>
    </Box>
  );
};
