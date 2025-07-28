import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface ClassificationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClassificationModal = ({
  open,
  onClose,
  onConfirm,
}: ClassificationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ px: 0, textAlign: "center" }}>
        Deseja utilizar o modelo padrão de classificação para os balancetes?
      </DialogTitle>
      <DialogActions sx={{ px: 0, mt: 2, justifyContent: "flex-end" }}>
        <Button onClick={onClose} color="inherit">
          Criar uma nova classificação
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Utilizar padrão
        </Button>
      </DialogActions>
    </Dialog>
  );
};
