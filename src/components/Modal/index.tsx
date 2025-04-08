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
}

const style = (width: number | string = 400) => ({
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
});

export const ModalCustom = ({
  open,
  onClose,
  title,
  children,
  width = "auto",
  onSubmit,
}: ModalCustomProps) => {
  return (
    <Modal open={open} onClose={onClose} hideBackdrop={false}>
      <Box sx={style(width)}>
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
        <Box sx={{ display: "flex", mt: 4, justifyContent: "space-between" }}>
          <Button text="Cancelar" variant="secondary" onSubmit={onClose} />
          <Button text="Salvar" onSubmit={onSubmit} />
        </Box>
      </Box>
    </Modal>
  );
};
