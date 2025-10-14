import { Button } from "@mui/material";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

interface ExportButtonProps {
  onClick: () => void;
}

export const ExportButton = ({ onClick }: ExportButtonProps) => {
  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={onClick}
      startIcon={<OpenInNewOutlinedIcon />}
      sx={{
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 500,
        px: 2,
      }}
    >
      Exportar
    </Button>
  );
};
