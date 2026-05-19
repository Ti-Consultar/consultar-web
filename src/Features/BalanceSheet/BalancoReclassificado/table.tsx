import React, { useEffect, useMemo, useState } from "react";
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
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import { StickyCell, StickyHead, StickyHeadFirstCell } from "./styles";
import { MergedMonth, MonthRaw } from "../../../types/BalancoReclassificado";
import { Totalizer } from "../../../types/balanco";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";

const HIDDEN_MONTHS_STORAGE_KEY = "balancoReclassificadoTable.hiddenMonths";

interface FinancialTableProps {
  realizado: { months: MonthRaw[] };
  orcado: { months: MonthRaw[] };
  variacao: { months: MonthRaw[] };
  showBudgetColumns?: boolean;
  highlightRows?: Record<number, boolean>;
  metricNature?: Record<string, "receita" | "despesa">;
  nestedMode?: "NONE" | "DRE";
  isExpandedView?: boolean;
}

export const BalancoReclassificadoTable = ({
  realizado,
  orcado,
  variacao,
  showBudgetColumns = false,
  highlightRows = {},
  metricNature,
  nestedMode = "NONE",
  isExpandedView = false,
}: FinancialTableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();

  const [openModal, setOpenModal] = useState(false);
  const [openExpandedModal, setOpenExpandedModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDetails, setSelectedDetails] = useState<any[]>([]);
  const [hiddenMonthKeys, setHiddenMonthKeys] = useState<string[]>([]);
  const [monthMenuAnchor, setMonthMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

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
      ([, num]) => num === m.dateMonth,
    );
    return byNum?.[0] ?? "";
  };

  const mergedMonths: MergedMonth[] = useMemo(() => {
    const map = new Map<string, MergedMonth>();

    const ensure = (m: MonthRaw) => {
      const key = canonicalMonthKey(m);
      if (!map.has(key)) {
        map.set(key, {
          id: Number.isFinite(m.dateMonth) ? (m.dateMonth as number) : m.id,
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

  useEffect(() => {
    const loadHiddenMonthKeys = () => {
      try {
        const raw = localStorage.getItem(HIDDEN_MONTHS_STORAGE_KEY);
        if (!raw) {
          setHiddenMonthKeys([]);
          return;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHiddenMonthKeys(parsed.filter((key) => typeof key === "string"));
        }
      } catch {
        setHiddenMonthKeys([]);
      }
    };

    loadHiddenMonthKeys();

    window.addEventListener("storage", loadHiddenMonthKeys);
    window.addEventListener(
      "balanco-reclassificado-months-change",
      loadHiddenMonthKeys,
    );

    return () => {
      window.removeEventListener("storage", loadHiddenMonthKeys);
      window.removeEventListener(
        "balanco-reclassificado-months-change",
        loadHiddenMonthKeys,
      );
    };
  }, []);

  const monthOptions = useMemo(
    () =>
      mergedMonths.map((m) => ({
        key: String(m.dateMonth ?? m.id),
        label: monthTranslator[m.name] ?? m.name,
      })),
    [mergedMonths],
  );

  const visibleMonths = useMemo(() => {
    const hidden = new Set(hiddenMonthKeys);
    return mergedMonths.filter(
      (m) => !hidden.has(String(m.dateMonth ?? m.id)),
    );
  }, [hiddenMonthKeys, mergedMonths]);

  const persistHiddenMonthKeys = (keys: string[]) => {
    setHiddenMonthKeys(keys);
    localStorage.setItem(HIDDEN_MONTHS_STORAGE_KEY, JSON.stringify(keys));
    window.dispatchEvent(new Event("balanco-reclassificado-months-change"));
  };

  const toggleMonthVisibility = (monthKey: string) => {
    const isHidden = hiddenMonthKeys.includes(monthKey);
    const nextHidden = isHidden
      ? hiddenMonthKeys.filter((key) => key !== monthKey)
      : [...hiddenMonthKeys, monthKey];

    persistHiddenMonthKeys(nextHidden);
  };

  const showAllMonths = () => persistHiddenMonthKeys([]);

  const hideAllMonths = () =>
    persistHiddenMonthKeys(monthOptions.map((month) => month.key));

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
        })),
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
    if (v === undefined || v === null || v === 0) return "-";
    if (isPercentageRow(name ?? "")) {
      return `${v.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`;
    }
    let x = Math.abs(v);
    if (valueMode === "MILHAR") x /= 1000;
    if (valueMode === "MILHARES") x /= 1_000_000;
    const txt = x.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
    return v < 0 ? `(${txt})` : txt;
  };

  const tMonth = (name: string) => monthTranslator[name] ?? name;

  const isYtdMonth = (m: MergedMonth) =>
    m.dateMonth === 13 ||
    ["YTD", "ACUMULADO"].includes((m.name ?? "").trim().toUpperCase());

  const dataCellHover = {
    cursor: "pointer",
    "&:hover": { backgroundColor: theme.palette.grey[200] },
  };

  const openDetails = (
    name: string,
    datas: any[] | undefined,
    month: string,
  ) => {
    if (!datas?.length) return;
    setSelectedTitle(`${name} - ${tMonth(month)}`);
    setSelectedDetails(datas);
    setOpenModal(true);
  };

  const getVarVisual = (
    value: number | undefined,
    name: string,
    real?: number | null,
    budget?: number | null,
  ) => {
    // Se a tabela não estiver no modo DRE, não aplica setas nem cores
    if (nestedMode !== "DRE") {
      return { arrow: "", color: "inherit" };
    }

    // Caso não haja variação calculada
    if (value === undefined || value === null) {
      return { arrow: "", color: "inherit" };
    }

    // Se não houver ambos (orçado e realizado), não há base pra comparação
    if (
      real === undefined ||
      real === null ||
      budget === undefined ||
      budget === null
    ) {
      return { arrow: "", color: "inherit" };
    }

    // Se a variação for exatamente 0 (valores idênticos)
    if (value === 0) {
      return { arrow: "", color: "inherit" };
    }

    const isPositive = value > 0;
    const nature = metricNature?.[name] ?? "receita";
    const isExpense = nature === "despesa";

    // Receita → positivo é bom / Despesa → negativo é bom
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
    type: "bud" | "real" | "var",
  ) => {
    const list =
      type === "real" ? m.realRows : type === "bud" ? m.budgetRows : m.varRows;
    const row = list.find((x: any) => x.id === tot);
    const c = row?.classifications?.find((x: any) => x.id === cls);
    return c?.value;
  };

  const hasAnyTotalizerValue = (totId: number) => {
    return mergedMonths.some((m) => {
      const real = m.realRows.find((x) => x.id === totId)?.totalValue ?? 0;
      const bud = m.budgetRows.find((x) => x.id === totId)?.totalValue ?? 0;
      const vari = m.varRows.find((x) => x.id === totId)?.totalValue ?? 0;

      return (
        (real !== 0 && real !== null) ||
        (bud !== 0 && bud !== null) ||
        (vari !== 0 && vari !== null)
      );
    });
  };

  const hasAnyClassificationValue = (totId: number, clsId: number) => {
    return mergedMonths.some((m) => {
      const real = getClassValue(m, totId, clsId, "real") ?? 0;
      const bud = getClassValue(m, totId, clsId, "bud") ?? 0;
      const vari = getClassValue(m, totId, clsId, "var") ?? 0;

      return (
        (real !== 0 && real !== null) ||
        (bud !== 0 && bud !== null) ||
        (vari !== 0 && vari !== null)
      );
    });
  };

  const getHighlightCellSx = (hl: boolean) =>
    hl
      ? {
          borderTop: `2px solid ${theme.palette.grey[500]}`,
          borderBottom: `2px solid ${theme.palette.grey[500]}`,
        }
      : {};

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ViewColumnIcon />}
          onClick={(event) => setMonthMenuAnchor(event.currentTarget)}
          disabled={!monthOptions.length}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Meses
        </Button>

        {!isExpandedView && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInFullIcon />}
            onClick={() => setOpenExpandedModal(true)}
            disabled={isEmpty}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Expandir
          </Button>
        )}
      </Box>

      <Menu
        anchorEl={monthMenuAnchor}
        open={Boolean(monthMenuAnchor)}
        onClose={() => setMonthMenuAnchor(null)}
        PaperProps={{
          sx: {
            width: 260,
            maxHeight: 420,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={showAllMonths} dense>
          <RestartAltIcon fontSize="small" sx={{ mr: 1.5 }} />
          <ListItemText primary="Mostrar todos os meses" />
        </MenuItem>
        <MenuItem onClick={hideAllMonths} dense disabled={!monthOptions.length}>
          <ViewColumnIcon fontSize="small" sx={{ mr: 1.5 }} />
          <ListItemText primary="Desmarcar todos" />
        </MenuItem>
        <Divider />
        {monthOptions.map((month) => {
          const checked = !hiddenMonthKeys.includes(month.key);
          return (
            <MenuItem
              key={month.key}
              onClick={() => toggleMonthVisibility(month.key)}
              dense
            >
              <Checkbox checked={checked} size="small" />
              <ListItemText primary={month.label} />
            </MenuItem>
          );
        })}
      </Menu>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: isExpandedView ? "calc(100vh - 190px)" : 650,
          position: "relative",
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        {isEmpty ? (
          <Box textAlign="center" p={4}>
            <InboxIcon
              sx={{ fontSize: 48, color: theme.palette.text.disabled }}
            />
            <Typography>Nada a exibir</Typography>
          </Box>
        ) : (
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    ...StickyHeadFirstCell,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  Descrição
                </TableCell>
                {visibleMonths.map((m) => (
                  <TableCell
                    key={m.id}
                    align="center"
                    colSpan={showBudgetColumns ? 3 : 1}
                    sx={{
                      ...StickyHead,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {isYtdMonth(m) ? (
                      <Tooltip title="Year to Date">
                        <b>{tMonth(m.name)}</b>
                      </Tooltip>
                    ) : (
                      <b>{tMonth(m.name)}</b>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {showBudgetColumns && (
                <TableRow>
                  <TableCell
                    sx={{
                      ...StickyHeadFirstCell,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  {visibleMonths.map((m) => (
                    <React.Fragment key={m.id}>
                      <TableCell
                        align="right"
                        sx={{
                          ...StickyHead,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        Orçado
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          ...StickyHead,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        Realizado
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          ...StickyHead,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        Variação
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {allTotalizers
                .filter((t) => hasAnyTotalizerValue(t.id))
                .map((t) => {
                  const hl = !!highlightRows[t.id];
                  const rowBg = hl
                    ? theme.palette.grey[300]
                    : theme.palette.background.paper;

                  return (
                    <React.Fragment key={t.id}>
                      {/* Linha de totalizador */}
                      <TableRow
                        sx={{
                          background: rowBg,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell
                          sx={{
                            ...StickyCell,
                            fontWeight: hl ? "bold" : 400,
                            color: hl ? theme.palette.text.primary : "inherit",
                            background: rowBg,
                            border: `1px solid ${theme.palette.divider}`,
                            ...getHighlightCellSx(hl),
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

                        {visibleMonths.map((m) =>
                          !showBudgetColumns ? (
                            <TableCell
                              key={`${m.id}-real-${t.id}`}
                              align="right"
                              sx={{
                                ...(hasDatasFor(m, t.id) ? dataCellHover : {}),
                                border: `1px solid ${theme.palette.divider}`,
                                ...getHighlightCellSx(hl),
                                cursor: hasDatasFor(m, t.id)
                                  ? "pointer"
                                  : "default",
                              }}
                              onClick={() =>
                                hasDatasFor(m, t.id) && openTotalsModal(t, m)
                              }
                            >
                              {formatValue(
                                m.realRows.find((x) => x.id === t.id)
                                  ?.totalValue,
                                t.name,
                              )}
                            </TableCell>
                          ) : (
                            <React.Fragment key={m.id}>
                              <TableCell
                                align="right"
                                sx={{
                                  ...dataCellHover,
                                  border: `1px solid ${theme.palette.divider}`,
                                  ...getHighlightCellSx(hl),
                                }}
                              >
                                {formatValue(
                                  m.budgetRows.find((x) => x.id === t.id)
                                    ?.totalValue,
                                  t.name,
                                )}
                              </TableCell>

                              <TableCell
                                align="right"
                                sx={{
                                  ...dataCellHover,
                                  border: `1px solid ${theme.palette.divider}`,
                                  ...getHighlightCellSx(hl),
                                }}
                              >
                                {formatValue(
                                  m.realRows.find((x) => x.id === t.id)
                                    ?.totalValue,
                                  t.name,
                                )}
                              </TableCell>

                              <TableCell
                                align="right"
                                sx={{
                                  ...dataCellHover,
                                  border: `1px solid ${theme.palette.divider}`,
                                  ...getHighlightCellSx(hl),
                                }}
                              >
                                {(() => {
                                  const v = m.varRows.find(
                                    (x) => x.id === t.id,
                                  )?.totalValue;
                                  const real =
                                    m.realRows.find((x) => x.id === t.id)
                                      ?.totalValue ?? null;
                                  const budget =
                                    m.budgetRows.find((x) => x.id === t.id)
                                      ?.totalValue ?? null;
                                  const { arrow, color } = getVarVisual(
                                    v,
                                    t.name,
                                    real,
                                    budget,
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
                          ),
                        )}
                      </TableRow>

                      {/* Classificações (DRE) */}
                      {nestedMode === "DRE" &&
                        (t.classifications ?? [])
                          .filter((c) => hasAnyClassificationValue(t.id, c.id))
                          .map((c) => (
                            <TableRow
                              key={c.id}
                              sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <TableCell
                                sx={{
                                  ...StickyCell,
                                  pl: 4,
                                  border: `1px solid ${theme.palette.divider}`,
                                }}
                              >
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

                              {visibleMonths.map((m) => {
                                const realRow = m.realRows.find(
                                  (x) => x.id === t.id,
                                );
                                const clsReal = realRow?.classifications?.find(
                                  (x) => x.id === c.id,
                                );
                                const datas = clsReal?.datas;

                                if (!showBudgetColumns) {
                                  const vReal = getClassValue(
                                    m,
                                    t.id,
                                    c.id,
                                    "real",
                                  );
                                  return (
                                    <TableCell
                                      key={m.id}
                                      align="right"
                                      sx={{
                                        border: `1px solid ${theme.palette.divider}`,
                                        ...(datas?.length ? dataCellHover : {}),
                                      }}
                                      onClick={() =>
                                        datas?.length &&
                                        openDetails(c.name, datas, m.name)
                                      }
                                    >
                                      {formatValue(vReal, c.name)}
                                    </TableCell>
                                  );
                                }

                                const vBud = getClassValue(
                                  m,
                                  t.id,
                                  c.id,
                                  "bud",
                                );
                                const vReal = getClassValue(
                                  m,
                                  t.id,
                                  c.id,
                                  "real",
                                );
                                const vVar = getClassValue(
                                  m,
                                  t.id,
                                  c.id,
                                  "var",
                                );
                                const { arrow, color } = getVarVisual(
                                  vVar,
                                  c.name,
                                  vReal,
                                  vBud,
                                );

                                return (
                                  <React.Fragment key={m.id}>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        border: `1px solid ${theme.palette.divider}`,
                                      }}
                                    >
                                      {formatValue(vBud, c.name)}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        border: `1px solid ${theme.palette.divider}`,
                                        ...(datas?.length ? dataCellHover : {}),
                                      }}
                                      onClick={() =>
                                        datas?.length &&
                                        openDetails(c.name, datas, m.name)
                                      }
                                    >
                                      {formatValue(vReal, c.name)}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        border: `1px solid ${theme.palette.divider}`,
                                      }}
                                    >
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

            {visibleMonths[0]?.totalReal !== null && (
              <TableBody>
                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                  <TableCell
                    sx={{
                      ...StickyCell,
                      fontWeight: "bold",
                      backgroundColor: theme.palette.grey[200],
                    }}
                  >
                    {realizado.months[0]?.monthPainelContabilTotalizer?.name ??
                      "Total"}
                  </TableCell>

                  {visibleMonths.map((m) =>
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
                              "Total",
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
                    ),
                  )}
                </TableRow>
              </TableBody>
            )}
          </Table>
        )}
      </TableContainer>

      {!isExpandedView && (
        <Dialog
          open={openExpandedModal}
          onClose={() => setOpenExpandedModal(false)}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: "calc(100vw - 48px)",
              height: "calc(100vh - 48px)",
              maxWidth: "none",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "1.1rem",
              fontWeight: 700,
              pb: 1,
            }}
          >
            Demonstrações Financeiras
            <IconButton
              aria-label="Fechar tabela expandida"
              onClick={() => setOpenExpandedModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2.5, pt: 1 }}>
            <BalancoReclassificadoTable
              realizado={realizado}
              orcado={orcado}
              variacao={variacao}
              showBudgetColumns={showBudgetColumns}
              highlightRows={highlightRows}
              metricNature={metricNature}
              nestedMode={nestedMode}
              isExpandedView
            />
          </DialogContent>
        </Dialog>
      )}

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
