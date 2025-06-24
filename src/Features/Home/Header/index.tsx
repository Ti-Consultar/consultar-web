import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { useTheme } from "@mui/material/styles";

interface GroupsHeaderProps {
  onSearchChange: (value: string) => void;
  onExportClick: () => void;
  onAddGroupClick: () => void;
  viewMode: "list" | "grid";
  onChangeViewMode: (mode: "list" | "grid") => void;
}

export const GroupsHeader = ({
  onSearchChange,
  onAddGroupClick,
  viewMode,
  onChangeViewMode,
}: GroupsHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
        mb={2}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Grupos
          </Typography>
          <Box sx={{ gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddGroupClick}
              sx={{ backgroundColor: "#2F63A4" }}
            >
              Adicionar
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box display="flex" flex={1} justifyContent="space-between">
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

          <Box
            display="flex"
            gap={1}
            justifyContent={isMobile ? "center" : "flex-end"}
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
