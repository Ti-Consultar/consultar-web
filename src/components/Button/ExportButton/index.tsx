import { Button } from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface ExportButtonProps {
  onClick: () => void;
}

export const ExportButton = ({ onClick }: ExportButtonProps) => {
  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={onClick}
      startIcon={<FileDownloadOutlinedIcon />}
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
