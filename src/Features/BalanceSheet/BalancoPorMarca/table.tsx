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
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { StickyCell, StickyHead, StickyHeadFirstCell } from "./styles";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import { NormalizedDreTable } from "../../../types/balancoPorMarca";

interface Props {
  data: NormalizedDreTable | null;
}

export const DreConsolidatedTable = ({ data }: Props) => {
  const { valueMode } = useValueDisplay();

  const colors = {
    headerBg: "#E5E7EB",
    rowBg: "#F9FAFB",
    rowAltBg: "#F3F4F6",
    totalBg: "#FFFFFF",

    highlightBg: "#DBEAFE",
    highlightHeaderBg: "#BFDBFE",

    groupBg: "#CBD5E1",

    textPrimary: "#111827",
    border: "#E5E7EB",
    hover: "#EDEDED",
  };

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

    if (v < 0) {
      return <span>({txt})</span>;
    }

    return txt;
  };

  const isEmpty = !data || data.rows.length === 0;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        maxHeight: 650,
        overflow: "auto",
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
      }}
    >
      {isEmpty ? (
        <Box textAlign="center" p={4}>
          <InboxIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography>Nada a exibir</Typography>
        </Box>
      ) : (
        <Table size="small" sx={{ borderCollapse: "separate" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...StickyHeadFirstCell,
                  backgroundColor: colors.headerBg,
                  borderRight: `1px solid ${colors.border}`,
                }}
              >
                Descrição
              </TableCell>

              {data.columns.map((c) => {
                const isGroup = c.isGroup;
                const isBSB = c.label.includes("BSB");

                return (
                  <TableCell
                    key={c.key}
                    align="right"
                    sx={{
                      ...StickyHead,
                      fontWeight: isGroup || isBSB ? 700 : 500,
                      backgroundColor: isBSB
                        ? colors.highlightHeaderBg
                        : isGroup
                          ? colors.groupBg
                          : colors.headerBg,
                      borderRight: `1px solid ${colors.border}`,
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

              const rowBg =
                r.rowType === "TOTALIZER"
                  ? colors.totalBg
                  : idx % 2 === 0
                    ? colors.rowBg
                    : colors.rowAltBg;

              return (
                <TableRow
                  key={`${r.rowType}-${idx}`}
                  sx={{
                    backgroundColor: rowBg,
                    "&:hover td": {
                      backgroundColor: colors.hover,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      ...StickyCell,
                      backgroundColor: rowBg,
                      fontWeight: r.rowType === "TOTALIZER" ? 700 : 400,
                      pl: r.rowType === "CLASSIFICATION" ? 4 : 2,
                      borderRight: `1px solid ${colors.border}`,
                    }}
                  >
                    {r.name}
                  </TableCell>

                  {data.columns.map((c) => {
                    const isGroup = c.isGroup;
                    const isBSB = c.label.includes("BSB");

                    return (
                      <TableCell
                        key={c.key}
                        align="right"
                        sx={{
                          fontWeight: r.rowType === "TOTALIZER" ? 700 : 400,

                          backgroundColor: isBSB
                            ? colors.highlightBg
                            : isGroup
                              ? colors.groupBg
                              : rowBg,

                          borderRight: `1px solid ${colors.border}`,
                        }}
                      >
                        {formatValue(r.values[c.key], isPercentageRow)}
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
