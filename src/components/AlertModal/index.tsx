import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Error, Info, CheckCircle } from "@mui/icons-material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

type AlertType = "info" | "warning" | "error" | "success";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
  showCancel?: boolean;
}

const iconMap = {
  info: <Info color="info" fontSize="large" />,
  warning: <WarningAmberRoundedIcon color="warning" fontSize="large" />,
  error: <Error color="error" fontSize="large" />,
  success: <CheckCircle color="success" fontSize="large" />,
};

export const AlertModal = ({
  open,
  onClose,
  onConfirm,
  title = "Atenção",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "info",
  showCancel = true,
}: AlertModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          padding: 1.5
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {iconMap[type]}
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "12px" }}>
        {showCancel && (
          <Button
            color="inherit"
            variant="text"
            onClick={onClose}
            sx={{
              textTransform: "none",
            }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          color="primary"
          onClick={onConfirm}
          disableElevation
          sx={{
            textTransform: "none",
          }}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
