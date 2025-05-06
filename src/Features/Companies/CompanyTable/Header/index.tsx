import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import React, { useState } from "react";
import { InactiveCompaniesModal } from "../../InactiveCompaniesModal";
import { getDeletedCompanies } from "../../../../services/apis/routes/companies.service";
import { useAuth } from "../../../../utils/hooks/useAuth";
import { useParams } from "react-router";

interface TableToolbarProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onExport: (format: string) => void;
  onReactivate: (selectedIds: number[]) => Promise<void>;
}

export const TableToolbar = ({
  title,
  searchValue,
  onSearchChange,
  onAddClick,
  onExport,
  onReactivate,
}: TableToolbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletedCompanies, setDeletedCompanies] = useState<any[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const userData = useAuth();
  const { groupId } = useParams();

  const fetchDeletedCompanies = async () => {
    try {
      if (!userData?.userId || !groupId) return;
      const response = await getDeletedCompanies(
        Number(userData.userId),
        Number(groupId)
      );
      const formatted = response.data.companies.map((item: any) => ({
        id: item.companyId,
        nome: item.businessEntity.nomeFantasia || item.companyName,
        cnpj: item.businessEntity.cnpj,
      }));
      setDeletedCompanies(formatted);
    } catch (error) {
      console.error("Erro ao buscar empresas inativas", error);
    }
  };

  const handleOpenModal = () => {
    fetchDeletedCompanies();
    setModalOpen(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (format: string) => {
    setAnchorEl(null);
    onExport(format);
  };

  return (
    <Box
      px={2}
      py={2}
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: "var(--neutral-100)",
        borderBottom: "1px solid #eee",
        width: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600} color="var(--neutral-500)">
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          size="small"
          fullWidth={isMobile}
          placeholder="Pesquisar..."
          value={searchValue}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#98A2B3" }} />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1 : 2}
          alignItems="stretch"
          sx={{ width: isMobile ? "100%" : "auto" }}
        >
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddClick}
              fullWidth
              sx={{
                textTransform: "none",
                backgroundColor: "var(--branding-default-blue)",
              }}
            >
              Adicionar
            </Button>

            <Button
              variant="outlined"
              color="warning"
              onClick={handleOpenModal}
              startIcon={<Inventory2OutlinedIcon />}
              fullWidth
              sx={{
                textTransform: "none",
              }}
            >
              Inativos
            </Button>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleClick}
            fullWidth
            sx={{
              textTransform: "none",
              color: "var(--neutral-500)",
              borderColor: "var(--neutral-500)",
            }}
          >
            Exportar
          </Button>

          <InactiveCompaniesModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            inactiveCompanies={deletedCompanies}
            onReactivate={onReactivate}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 4,
              sx: {
                borderRadius: 3,
                minWidth: 150,
                p: 1,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem onClick={() => handleClose("CSV")}>
              Exportar para .csv
            </MenuItem>
            <MenuItem onClick={() => handleClose("PDF")}>
              Exportar para .pdf
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
};
