import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";

interface Classification {
  id: number;
  typeOrder: number;
  name: string;
  value: number;
  datas?: any[];
}

interface Totalizer {
  id: number;
  typeOrder: number;
  name: string;
  totalValue: number;
  classifications?: Classification[];
}

interface MonthRaw {
  id: number;
  name: string;
  dateMonth: number;
  monthPainelContabilTotalizer: { name: string; totalValue: number } | null;
  totalizer: Totalizer[];
}

interface FinancialTableProps {
  realizado: { months: MonthRaw[] };
  orcado: { months: MonthRaw[] };
  variacao: { months: MonthRaw[] };
  showBudgetColumns?: boolean;
  highlightRows?: Record<number, boolean>;
  metricNature?: Record<string, "receita" | "despesa">;
  nestedMode?: "NONE" | "DRE";
}

type MergedMonth = {
  id: number;
  name: string;
  dateMonth?: number;
  totalReal: number | null;
  totalBudget: number | null;
  totalVar: number | null;
  realRows: Totalizer[];
  budgetRows: Totalizer[];
  varRows: Totalizer[];
};

const BalancoReclassificadoTable = ({
  realizado,
  orcado,
  variacao,
  showBudgetColumns = false,
  highlightRows = {},
  metricNature,
  nestedMode = "NONE",
}: FinancialTableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDetails, setSelectedDetails] = useState<any[]>([]);

  const mergedMonths: MergedMonth[] = useMemo(() => {
    const ids = Array.from(
      new Set([
        ...realizado.months.map((m) => m.id),
        ...orcado.months.map((m) => m.id),
        ...variacao.months.map((m) => m.id),
      ])
    );

    return ids.map((id) => {
      const r = realizado.months.find((m) => m.id === id);
      const o = orcado.months.find((m) => m.id === id);
      const v = variacao.months.find((m) => m.id === id);

      return {
        id,
        name: r?.name || o?.name || v?.name || "",
        dateMonth: r?.dateMonth || o?.dateMonth || v?.dateMonth,
        totalReal: r?.monthPainelContabilTotalizer?.totalValue ?? null,
        totalBudget: o?.monthPainelContabilTotalizer?.totalValue ?? null,
        totalVar: v?.monthPainelContabilTotalizer?.totalValue ?? null,
        realRows: r?.totalizer ?? [],
        budgetRows: o?.totalizer ?? [],
        varRows: v?.totalizer ?? [],
      };
    });
  }, [realizado, orcado, variacao]);

  const allTotalizers = useMemo(() => {
    const map = new Map<number, Totalizer>();
    mergedMonths.forEach((m) => {
      m.realRows?.forEach((t) => {
        if (!map.has(t.id)) map.set(t.id, t);
      });
    });
    return Array.from(map.values()).sort((a, b) => a.typeOrder - b.typeOrder);
  }, [mergedMonths]);

  const isEmpty = mergedMonths.length === 0 || allTotalizers.length === 0;

  const isPercentageRow = (name: string) => name.trim().endsWith("%");

  const formatValue = (v: number | null | undefined, name?: string) => {
    if (v === undefined || v === null) return "-";
    if (isPercentageRow(name ?? "")) {
      return `${v.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`;
    }
    if (v === 0) return "-";
    let x = Math.abs(v);
    if (valueMode === "MILHAR") x /= 1000;
    if (valueMode === "MILHARES") x /= 1_000_000;
    const txt = x.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
    return v < 0 ? `(${txt})` : txt;
  };

  const monthTranslator: Record<string, string> = {
    January: "Janeiro",
    February: "Fevereiro",
    March: "Março",
    April: "Abril",
    May: "Maio",
    June: "Junho",
    July: "Julho",
    August: "Agosto",
    September: "Setembro",
    October: "Outubro",
    November: "Novembro",
    December: "Dezembro",
  };
  const tMonth = (name: string) => monthTranslator[name] ?? name;

  const Z = { head: 200, headFirst: 260, bodyFirst: 150 };
  const stickyHead = {
    position: "sticky" as const,
    top: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: Z.head,
  };
  const stickyHeadFirstCell = {
    ...stickyHead,
    left: 0,
    zIndex: Z.headFirst,
    fontWeight: "bold",
    minWidth: 260,
  };
  const stickyCell = {
    position: "sticky" as const,
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: Z.bodyFirst,
  };
  const dataCellHover = {
    cursor: "pointer",
    "&:hover": { backgroundColor: theme.palette.grey[200] },
  };

  const openDetails = (
    name: string,
    datas: any[] | undefined,
    month: string
  ) => {
    if (!datas?.length) return;
    setSelectedTitle(`${name} - ${tMonth(month)}`);
    setSelectedDetails(datas);
    setOpenModal(true);
  };

  const getVarVisual = (value: number | undefined, name: string) => {
    if (!value) return { arrow: "", color: "inherit" };
    const isPositive = value > 0;
    const nature = metricNature?.[name] ?? "receita";
    const isExpense = nature === "despesa";
    const good = isExpense ? !isPositive : isPositive;
    return {
      arrow: isPositive ? "▲" : "▼",
      color: good ? "#2e7d32" : "#d32f2f",
    };
  };

  const getClassValue = (
    m: any,
    tot: number,
    cls: number,
    type: "bud" | "real" | "var"
  ) => {
    const list =
      type === "real" ? m.realRows : type === "bud" ? m.budgetRows : m.varRows;
    const row = list.find((x: any) => x.id === tot);
    const c = row?.classifications?.find((x: any) => x.id === cls);
    return c?.value;
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 650, position: "relative" }}
      >
        {isEmpty ? (
          <Box textAlign="center" p={4}>
            <InboxIcon
              sx={{ fontSize: 48, color: theme.palette.text.disabled }}
            />
            <Typography>Nada a exibir</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={stickyHeadFirstCell}>Índice</TableCell>
                {mergedMonths.map((m) => (
                  <TableCell
                    key={m.id}
                    align="center"
                    colSpan={showBudgetColumns ? 3 : 1}
                    sx={stickyHead}
                  >
                    <b>{tMonth(m.name)}</b>
                  </TableCell>
                ))}
              </TableRow>

              {showBudgetColumns && (
                <TableRow>
                  <TableCell sx={stickyHeadFirstCell} />
                  {mergedMonths.map((m) => (
                    <React.Fragment key={m.id}>
                      <TableCell align="right" sx={stickyHead}>
                        Orçado
                      </TableCell>
                      <TableCell align="right" sx={stickyHead}>
                        Realizado
                      </TableCell>
                      <TableCell align="right" sx={stickyHead}>
                        Variação
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {allTotalizers.map((t) => {
                const hl = !!highlightRows[t.id];
                const rowBg = hl
                  ? theme.palette.grey[300]
                  : theme.palette.background.paper;

                return (
                  <React.Fragment key={t.id}>
                    <TableRow sx={{ background: rowBg }}>
                      <TableCell
                        sx={{
                          ...stickyCell,
                          fontWeight: hl ? "bold" : 400,
                          color: hl ? theme.palette.text.primary : "inherit",
                          background: rowBg,
                          "&:hover": {
                            backgroundColor: hl
                              ? theme.palette.grey[400]
                              : theme.palette.grey[200],
                          },
                        }}
                      >
                        <Tooltip title={t.name}>
                          <span
                            style={{
                              display: "inline-block",
                              maxWidth: 210,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t.name}
                          </span>
                        </Tooltip>
                      </TableCell>

                      {mergedMonths.map((m) =>
                        !showBudgetColumns ? (
                          <TableCell
                            key={m.id}
                            align="right"
                            sx={dataCellHover}
                          >
                            {formatValue(
                              m.realRows.find((x) => x.id === t.id)?.totalValue,
                              t.name
                            )}
                          </TableCell>
                        ) : (
                          <React.Fragment key={m.id}>
                            <TableCell align="right" sx={dataCellHover}>
                              {formatValue(
                                m.budgetRows.find((x) => x.id === t.id)
                                  ?.totalValue,
                                t.name
                              )}
                            </TableCell>
                            <TableCell align="right" sx={dataCellHover}>
                              {formatValue(
                                m.realRows.find((x) => x.id === t.id)
                                  ?.totalValue,
                                t.name
                              )}
                            </TableCell>
                            <TableCell align="right" sx={dataCellHover}>
                              {(() => {
                                const v = m.varRows.find(
                                  (x) => x.id === t.id
                                )?.totalValue;
                                const { arrow, color } = getVarVisual(
                                  v,
                                  t.name
                                );
                                return (
                                  <span
                                    style={{
                                      color,
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 4,
                                    }}
                                  >
                                    {formatValue(v, t.name)}
                                    {arrow}
                                  </span>
                                );
                              })()}
                            </TableCell>
                          </React.Fragment>
                        )
                      )}
                    </TableRow>

                    {nestedMode === "DRE" &&
                      (t.classifications ?? [])
                        .filter((c) =>
                          mergedMonths.some((m) =>
                            getClassValue(m, t.id, c.id, "real")
                          )
                        )
                        .map((c) => (
                          <TableRow key={c.id}>
                            <TableCell sx={{ ...stickyCell, pl: 4 }}>
                              <Tooltip title={c.name}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    maxWidth: 210,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {c.name}
                                </span>
                              </Tooltip>
                            </TableCell>

                            {mergedMonths.map((m) => {
                              const realRow = m.realRows.find(
                                (x) => x.id === t.id
                              );
                              const clsReal = realRow?.classifications?.find(
                                (x) => x.id === c.id
                              );
                              const datas = clsReal?.datas;

                              if (!showBudgetColumns) {
                                const vReal = getClassValue(
                                  m,
                                  t.id,
                                  c.id,
                                  "real"
                                );
                                return (
                                  <TableCell
                                    key={m.id}
                                    align="right"
                                    sx={datas?.length ? dataCellHover : {}}
                                  >
                                    {formatValue(vReal, c.name)}
                                  </TableCell>
                                );
                              }

                              const vBud = getClassValue(m, t.id, c.id, "bud");
                              const vReal = getClassValue(
                                m,
                                t.id,
                                c.id,
                                "real"
                              );
                              const vVar = getClassValue(m, t.id, c.id, "var");
                              const { arrow, color } = getVarVisual(
                                vVar,
                                c.name
                              );

                              return (
                                <React.Fragment key={m.id}>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      background: rowBg,
                                      "&:hover": {
                                        backgroundColor: hl
                                          ? theme.palette.grey[400]
                                          : theme.palette.grey[200],
                                      },
                                    }}
                                  >
                                    {formatValue(vBud, c.name)}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={datas?.length ? dataCellHover : {}}
                                    onClick={() =>
                                      datas?.length &&
                                      openDetails(c.name, datas, m.name)
                                    }
                                  >
                                    {formatValue(vReal, c.name)}
                                  </TableCell>
                                  <TableCell align="right">
                                    <span
                                      style={{
                                        color,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 4,
                                      }}
                                    >
                                      {formatValue(vVar, c.name)}
                                      {arrow}
                                    </span>
                                  </TableCell>
                                </React.Fragment>
                              );
                            })}
                          </TableRow>
                        ))}
                  </React.Fragment>
                );
              })}
            </TableBody>

            {mergedMonths[0]?.totalReal !== null && (
              <TableBody>
                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                  <TableCell sx={{ ...stickyCell, fontWeight: "bold" }}>
                    {realizado.months[0]?.monthPainelContabilTotalizer?.name ??
                      "Total"}
                  </TableCell>

                  {mergedMonths.map((m) =>
                    !showBudgetColumns ? (
                      <TableCell key={m.id} align="right">
                        <b>{formatValue(m.totalReal, "Total")}</b>
                      </TableCell>
                    ) : (
                      <React.Fragment key={m.id}>
                        <TableCell align="right">
                          <b>{formatValue(m.totalBudget, "Total")}</b>
                        </TableCell>
                        <TableCell align="right">
                          <b>{formatValue(m.totalReal, "Total")}</b>
                        </TableCell>
                        <TableCell align="right">
                          {(() => {
                            const { arrow, color } = getVarVisual(
                              m.totalVar ?? 0,
                              "Total"
                            );
                            return (
                              <span
                                style={{
                                  color,
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 4,
                                  fontWeight: 700,
                                }}
                              >
                                {formatValue(m.totalVar, "Total")}
                                {arrow}
                              </span>
                            );
                          })()}
                        </TableCell>
                      </React.Fragment>
                    )
                  )}
                </TableRow>
              </TableBody>
            )}
          </Table>
        )}
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{selectedTitle}</DialogTitle>
        <DialogContent dividers>
          {selectedDetails.map((d) => (
            <Box key={d.id} display="flex" justifyContent="space-between">
              <span>{d.name}</span>
              <b>{formatValue(d.value, d.name)}</b>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BalancoReclassificadoTable;
