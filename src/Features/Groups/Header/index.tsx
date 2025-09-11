import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { Protected } from "../../../components/Protection";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useEffect, useState } from "react";
import {
  InactiveCompaniesModal,
  InactiveCompany,
} from "../../Companies/InactiveCompaniesModal";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

interface GroupsHeaderProps {
  onSearchChange: (value: string) => void;
  onExportClick: () => void;
  onAddGroupClick: () => void;
  viewMode: "list" | "grid";
  onChangeViewMode: (mode: "list" | "grid") => void;
  onReactivate: (selectedIds: number[]) => Promise<void>;
  deletedCompanies: InactiveCompany[];
}

interface UserData {
  exp: number;
  iat: number;
  ip: string;
  role: string;
  unique_name: string;
  userId: string;
}

export const GroupsHeader = ({
  onSearchChange,
  onAddGroupClick,
  onReactivate,
  deletedCompanies,
}: GroupsHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);
        setUserData(dataDecoded);
      } catch {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    else if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }
  const greeting = getGreeting();
  
  const headerFlexDirection = isMobile ? "column" : "row";
  const buttonsFlexDirection = isMobile ? "column" : "row";
  const buttonsAlign = isMobile ? "stretch" : "flex-end";

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={headerFlexDirection}
        alignItems={isMobile ? "stretch" : "center"}
        mb={2}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 1,
            justifyContent: "space-between",
            flexDirection: headerFlexDirection,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={isMobile ? 1 : 0}>
            {greeting}, {userData?.unique_name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: buttonsFlexDirection,
              gap: 1,
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: buttonsAlign,
            }}
          >
            <Protected
              allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
            >
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setModalOpen(true)}
                startIcon={<Inventory2OutlinedIcon />}
                sx={{ textTransform: "none" }}
              >
                Inativos
              </Button>
            </Protected>

            <Protected
              allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddGroupClick}
                sx={{
                  backgroundColor: "#2F63A4",
                  textTransform: "none",
                  width: isMobile ? "100%" : "auto", // botão full width no mobile
                }}
              >
                Adicionar
              </Button>
            </Protected>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 1 : 0}
          justifyContent="space-between"
          alignItems={isMobile ? "stretch" : "center"}
        >
          <TextField
            size="small"
            placeholder="Pesquisar"
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: isMobile ? "100%" : 300,
              backgroundColor: "var(--neutral-white)",
            }}
          />

          {/* <Box
            display="flex"
            gap={1}
            justifyContent={viewModeJustify}
            mt={isMobile ? 1 : 0}
          >
            <Box display="flex" bgcolor="#F1F2F4" borderRadius={1}>
              <IconButton
                onClick={() => onChangeViewMode("list")}
                color={viewMode === "list" ? "primary" : "default"}
              >
                <ViewListIcon />
              </IconButton>
              <IconButton
                onClick={() => onChangeViewMode("grid")}
                color={viewMode === "grid" ? "primary" : "default"}
              >
                <GridViewIcon />
              </IconButton>
            </Box>
          </Box> */}
        </Box>
      </Box>

      <InactiveCompaniesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        inactiveCompanies={deletedCompanies}
        onReactivate={onReactivate}
      />
    </Box>
  );
};
