import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";

type ExportDialogProps = {
  open: boolean;
  onClose: () => void;
  hasChart: boolean;
  onExport: (format: string, includeCharts: boolean) => void;
};

export const ExportDialog = ({
  open,
  onClose,
  hasChart,
  onExport,
}: ExportDialogProps) => {
  const [format, setFormat] = useState("PDF");
  const [includeCharts, setIncludeCharts] = useState(true);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 6,
          p: 5,
          textAlign: "center",
        },
      }}
    >
      {/* Fechar */}
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 12, top: 12 }}
      >
        <CloseIcon />
      </IconButton>

      {/* Ícone superior */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "var(--branding-default-blue)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <DescriptionIcon sx={{ color: "#fff", fontSize: 32 }} />
      </Box>

      {/* Título e subtítulo */}
      <DialogTitle sx={{ fontWeight: 600, color: "var(--neutral-700)", p: 0 }}>
        Exportar Tabela
      </DialogTitle>
      <Typography sx={{ color: "var(--neutral-700)", mb: 3 }}>
        Selecione como você deseja exportar essa tabela.
      </Typography>

      <DialogContent sx={{ p: 0 }}>
        {/* Botões Toggle */}
        <ToggleButtonGroup
          exclusive
          value={format}
          onChange={(_, val) => val && setFormat(val)}
          fullWidth
          sx={{
            borderRadius: "50px",
            overflow: "hidden",
            mb: 3,
          }}
        >
          {["PDF", "CSV", "EXCEL", ...(hasChart ? ["PPT"] : [])].map((item) => (
            <ToggleButton
              key={item}
              value={item}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                flex: 1,
                border: "none",
                "&.Mui-selected": {
                  bgcolor: "var(--branding-default-blue)",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "var(--branding-default-blue)",
                  },
                },
              }}
            >
              {item}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {hasChart && (
          <FormControlLabel
            control={
              <Switch
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "var(--branding-default-blue)",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    bgcolor: "var(--branding-default-blue)",
                  },
                }}
              />
            }
            label="Incluir gráficos"
            labelPlacement="start"
            sx={{
              justifyContent: "space-between",
              width: "100%",
              m: 0,
              color: "var(--neutral-700)",
            }}
          />
        )}

        <Button
          variant="outlined"
          fullWidth
          onClick={() => onExport(format, includeCharts)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            mt: 3,
          }}
        >
          EXPORTAR
        </Button>
      </DialogContent>
    </Dialog>
  );
};
