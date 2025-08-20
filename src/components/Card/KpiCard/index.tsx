import { Box, Chip, Typography } from "@mui/material";
import { CardContainer } from "./styles";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";

interface KpiCardInterface {
  title?: string;
  value?: number;
  variation?: number;
}

export const KpiCard = ({
  title = "-",
  value = 0,
  variation = 0,
}: KpiCardInterface) => {
  function formatCurrencyBR(value: number): string {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <CardContainer>
      <Typography fontWeight={"bold"}>{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontWeight={"medium"} fontSize={"2rem"}>
          {formatCurrencyBR(value)}
        </Typography>
        <Chip
          label={`${variation}%`}
          sx={{
            backgroundColor: variation < 0 ? "#FEECEE" : "#E4F7F5",
            color: variation < 0 ? "#D14C6B" : "#4EB7AA",
            "& .MuiChip-icon": {
              color: variation < 0 ? "#D14C6B" : "#4EB7AA",
            },
          }}
          icon={
            <ArrowOutwardOutlinedIcon
              sx={{
                width: "18px",
                transform: variation < 0 ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease-in-out",
              }}
            />
          }
        />
      </Box>
    </CardContainer>
  );
};
