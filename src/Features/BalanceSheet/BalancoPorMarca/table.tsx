import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { StickyCell, StickyHead, StickyHeadFirstCell } from "./styles";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import { NormalizedDreTable } from "../../../types/balancoPorMarca";

interface Props {
  data: NormalizedDreTable | null;
}

export const DreConsolidatedTable = ({ data }: Props) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();

  const formatValue = (
    v: number | null | undefined,
    isPercentage?: boolean,
  ) => {
    if (v === null || v === undefined) return "-";

    if (isPercentage) {
      const txt = Math.abs(v).toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      });
      return `${txt}%`;
    }

    if (v === 0) return "-";

    let x = Math.abs(v);
    if (valueMode === "MILHAR") x /= 1_000;
    if (valueMode === "MILHARES") x /= 1_000_000;

    const txt = x.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
    return v < 0 ? `(${txt})` : txt;
  };

  const isEmpty = !data || data.rows.length === 0;

  const groupBorderColor = theme.palette.primary.main;
  const groupBg = theme.palette.primary.light + "22";

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        maxHeight: 650,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {isEmpty ? (
        <Box textAlign="center" p={4}>
          <InboxIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography>Nada a exibir</Typography>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={StickyHeadFirstCell}>Descrição</TableCell>

              {data.columns.map((c, idx) => {
                const isGroup = c.isGroup;

                return (
                  <TableCell
                    key={c.key}
                    align="right"
                    sx={{
                      ...StickyHead,
                      fontWeight: isGroup ? 700 : 500,
                      background: isGroup ? groupBg : undefined,
                      borderRight: `1px solid ${theme.palette.divider}`,
                      borderLeft: isGroup
                        ? `2px solid ${groupBorderColor}`
                        : idx === 0
                        ? `1px solid ${theme.palette.divider}`
                        : undefined,
                      borderTop: isGroup
                        ? `2px solid ${groupBorderColor}`
                        : undefined,
                    }}
                  >
                    {c.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.rows.map((r, idx) => {
              const isPercentageRow = r.name.includes("%");

              return (
                <TableRow
                  key={`${r.rowType}-${idx}`}
                  sx={{
                    background:
                      r.rowType === "TOTALIZER"
                        ? theme.palette.background.paper
                        : theme.palette.grey[50],
                  }}
                >
                  <TableCell
                    sx={{
                      ...StickyCell,
                      fontWeight: r.rowType === "TOTALIZER" ? 600 : 400,
                      pl: r.rowType === "CLASSIFICATION" ? 4 : 2,
                    }}
                  >
                    {r.name}
                  </TableCell>

                  {data.columns.map((c) => {
                    const isGroup = c.isGroup;

                    return (
                      <TableCell
                        key={c.key}
                        align="right"
                        sx={{
                          fontWeight:
                            r.rowType === "TOTALIZER" && isGroup ? 700 : 400,
                          background: isGroup ? groupBg : undefined,
                          borderRight: isGroup
                            ? `2px solid ${groupBorderColor}`
                            : `1px solid ${theme.palette.divider}`,
                          borderLeft: isGroup
                            ? `2px solid ${groupBorderColor}`
                            : undefined,
                        }}
                      >
                        {formatValue(
                          r.values[c.key],
                          isPercentageRow,
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};
