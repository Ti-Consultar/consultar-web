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

  const MONTH_NUM_BY_NAME: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
    ACUMULADO: 13,
  };

  const canonicalMonthKey = (m: MonthRaw) => {
    const dm = m.dateMonth ?? MONTH_NUM_BY_NAME[m.name];
    const keyNum = dm ?? -1;
    return String(keyNum);
  };

  const canonicalName = (m: MonthRaw) => {
    if (m.name) return m.name;
    const byNum = Object.entries(MONTH_NUM_BY_NAME).find(
      ([, num]) => num === m.dateMonth
    );
    return byNum?.[0] ?? "";
  };

  const mergedMonths: MergedMonth[] = useMemo(() => {
    const map = new Map<string, MergedMonth>();

    const ensure = (m: MonthRaw) => {
      const key = canonicalMonthKey(m);
      if (!map.has(key)) {
        map.set(key, {
          id: Number.isFinite(m.dateMonth) ? (m.dateMonth as number) : m.id, // id só pra React key
          name: canonicalName(m),
          dateMonth: m.dateMonth ?? MONTH_NUM_BY_NAME[m.name],
          totalReal: null,
          totalBudget: null,
          totalVar: null,
          realRows: [],
          budgetRows: [],
          varRows: [],
        });
      }
      return map.get(key)!;
    };

    realizado.months.forEach((m) => {
      const entry = ensure(m);
      entry.name ||= canonicalName(m);
      entry.totalReal = m.monthPainelContabilTotalizer?.totalValue ?? null;
      entry.realRows = m.totalizer ?? [];
    });

    orcado.months.forEach((m) => {
      const entry = ensure(m);
      entry.name ||= canonicalName(m);
      entry.totalBudget = m.monthPainelContabilTotalizer?.totalValue ?? null;
      entry.budgetRows = m.totalizer ?? [];
    });

    variacao.months.forEach((m) => {
      const entry = ensure(m);
      entry.name ||= canonicalName(m);
      entry.totalVar = m.monthPainelContabilTotalizer?.totalValue ?? null;
      entry.varRows = m.totalizer ?? [];
    });

    return Array.from(map.values()).sort((a, b) => {
      const an = a.dateMonth ?? 999;
      const bn = b.dateMonth ?? 999;
      return an - bn;
    });
  }, [realizado, orcado, variacao]);

  const hasDatasFor = (m: MergedMonth, totalizerId: number) => {
    const real = m.realRows.find((x) => x.id === totalizerId);
    return !!real?.classifications?.some((c) => (c.datas?.length ?? 0) > 0);
  };

  const openTotalsModal = (t: Totalizer, m: MergedMonth) => {
    const real = m.realRows.find((x) => x.id === t.id);
    if (!real?.classifications?.length) return;

    // junta todas as datas das classificações (só abre se tiver)
    const items =
      real.classifications.flatMap((c) =>
        (c.datas ?? []).map((d) => ({
          ...d,
          // deixa claro de qual classificação veio
          name: `${c.name} — ${d.name}`,
        }))
      ) ?? [];

    if (!items.length) return;

    setSelectedTitle(`${t.name} - ${tMonth(m.name)}`);
    setSelectedDetails(items);
    setOpenModal(true);
  };

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
    fontWeight: "bold",
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
                            key={`${m.id}-real-${t.id}`}
                            align="right"
                            sx={{
                              ...(hasDatasFor(m, t.id) ? dataCellHover : {}),
                              borderLeft: `1px solid ${theme.palette.divider}`,
                              cursor: hasDatasFor(m, t.id)
                                ? "pointer"
                                : "default",
                            }}
                            onClick={() =>
                              hasDatasFor(m, t.id) && openTotalsModal(t, m)
                            }
                          >
                            {formatValue(
                              m.realRows.find((x) => x.id === t.id)?.totalValue,
                              t.name
                            )}
                          </TableCell>
                        ) : (
                          <React.Fragment key={m.id}>
                            <TableCell
                              align="right"
                              sx={{
                                dataCellHover,
                                borderLeft: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              {formatValue(
                                m.budgetRows.find((x) => x.id === t.id)
                                  ?.totalValue,
                                t.name
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                dataCellHover,
                                borderLeft: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              {formatValue(
                                m.realRows.find((x) => x.id === t.id)
                                  ?.totalValue,
                                t.name
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                dataCellHover,
                                borderLeft: `1px solid ${theme.palette.divider}`,
                                borderRight: `1px solid ${theme.palette.divider}`,
                              }}
                            >
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
                                    sx={{
                                      borderLeft: `1px solid ${theme.palette.divider}`,
                                      ...(datas?.length ? dataCellHover : {}),
                                    }}
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
                                  <TableCell align="right">
                                    {formatValue(vBud, c.name)}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      borderLeft: `1px solid ${theme.palette.divider}`,
                                      ...(datas?.length ? dataCellHover : {}),
                                    }}
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: 420,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
            fontWeight: 600,
            pb: 1.5,
          }}
        >
          {selectedTitle}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            backgroundColor: "background.paper",
          }}
        >
          {selectedDetails.map((d) => (
            <Box
              key={d.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, fontWeight: 500 }}
              >
                {d.name}
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatValue(d.value, d.name)}
              </Typography>
            </Box>
          ))}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(false)}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BalancoReclassificadoTable;
