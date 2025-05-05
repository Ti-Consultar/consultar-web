import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Warning, Error, Info, CheckCircle } from "@mui/icons-material";

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
  warning: <Warning color="warning" fontSize="large" />,
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
          color="warning"
          onClick={onConfirm}
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
