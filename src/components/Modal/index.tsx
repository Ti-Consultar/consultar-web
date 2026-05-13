import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../Button";

interface ModalCustomProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  hasSaveCancel?: boolean;
}

const style = (
  width: number | string = 400,
  height?: number | string,
  padding: number | string = 4,
) => ({
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width,
  height,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100vh - 32px)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: padding,
  overflow: "hidden",
});

export const ModalCustom = ({
  open,
  onClose,
  title,
  children,
  width = "auto",
  height,
  padding = 4,
  hasSaveCancel = true,
  onSubmit,
}: ModalCustomProps) => {
  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus disableAutoFocus>
      <Box sx={style(width, height, padding)}>
        <Box
          alignContent={"space-between"}
          justifyContent={"space-between"}
          display="flex"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700} color="#3A5F9B" fontSize={"24px"}>
            {title}
          </Typography>

          <Box display={"flex"} justifyContent={"flex-end"}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {children}
        {hasSaveCancel ? (
          <Box sx={{ display: "flex", mt: 4, justifyContent: "space-between" }}>
            <Button text="Cancelar" variant="secondary" />
            <Button text="Salvar" onClick={onSubmit} />
          </Box>
        ) : null}
      </Box>
    </Modal>
  );
};
