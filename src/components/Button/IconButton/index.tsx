import { Button } from "@mui/material";
import { ReactNode } from "react";

interface MRPIconButtonProps {
  title: string;
  onClick: () => void;
  startIcon?: ReactNode;
}

export const MRPIconButton = ({
  title,
  onClick,
  startIcon,
}: MRPIconButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={startIcon}
      sx={{
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 500,
        px: 2,
      }}
    >
      {title}
    </Button>
  );
};
