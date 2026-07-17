import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

const ACCEPTED_FILE_TYPES =
  ".csv,.xlsx,text/csv,application/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

interface AccountPlanUploadModalProps {
  isReplacement: boolean;
  open: boolean;
  uploading: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<boolean>;
}

export const AccountPlanUploadModal = ({
  isReplacement,
  open,
  uploading,
  onClose,
  onUpload,
}: AccountPlanUploadModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setIsDragging(false);
    }
  }, [open]);

  const selectFile = (selectedFile?: File) => {
    if (selectedFile) setFile(selectedFile);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const uploaded = await onUpload(file);
    if (uploaded) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={uploading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--branding-default-blue)",
          fontWeight: 700,
          pr: 1,
        }}
      >
        {isReplacement ? "Substituir Plano de Contas" : "Subir plano de contas"}
        <IconButton
          onClick={onClose}
          disabled={uploading}
          aria-label="Fechar modal"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Arquivos suportados: .CSV e .XLSX
        </Alert>

        <Box
          role="button"
          tabIndex={0}
          aria-label="Selecionar arquivo do plano de contas"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          sx={{
            minHeight: 220,
            border: "2px dashed",
            borderColor: isDragging ? "primary.main" : "var(--neutral-300)",
            bgcolor: isDragging ? "rgba(58, 95, 155, 0.06)" : "grey.50",
            borderRadius: 2,
            px: 3,
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s, background-color 0.2s",
            outline: "none",
            "&:focus-visible": {
              borderColor: "primary.main",
              boxShadow: "0 0 0 3px rgba(58, 95, 155, 0.18)",
            },
          }}
        >
          {file ? (
            <>
              <InsertDriveFileOutlinedIcon
                color="primary"
                sx={{ fontSize: 48, mb: 1.5 }}
              />
              <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Clique ou arraste outro arquivo para substituir.
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon
                color="primary"
                sx={{ fontSize: 52, mb: 1.5 }}
              />
              <Typography fontWeight={600}>
                Arraste o arquivo para esta área
              </Typography>
              <Typography variant="body2" color="text.secondary" my={0.75}>
                ou
              </Typography>
              <Typography variant="body2" color="primary" fontWeight={600}>
                selecione um arquivo do computador
              </Typography>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            hidden
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileChange}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={uploading}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ textTransform: "none" }}
        >
          {uploading
            ? "Enviando..."
            : isReplacement
              ? "Substituir plano"
              : "Enviar arquivo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
