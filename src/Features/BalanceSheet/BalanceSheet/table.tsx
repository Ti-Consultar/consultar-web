import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import {
  MonthTableControls,
  useMonthVisibility,
} from "../../../components/TableControls/MonthTableControls";
import { monthTranslatorUtil } from "../../../utils/formatters/monthTranslator";
import {
  getDataValueByNameForMonth as getDataValueByNameForMonthHelper,
  getUniqueDataNames as getUniqueDataNamesHelper,
  hasAnyDatas as hasAnyDatasHelper,
} from "../accordionHelpers";

// Type definitions
interface FinancialData {
  id: number;
  typeOrder: number;
  name: string;
  value: number;
  costCenter?: string;
}

interface Classification {
  id: number;
  typeOrder: number;
  name: string;
  value: number;
  datas?: FinancialData[];
}

interface Totalizer {
  id: number;
  typeOrder: number;
  name: string;
  totalValue: number;
  classifications?: Classification[];
}

interface MonthPainelContabilTotalizer {
  name: string;
  totalValue: number;
}

interface Month {
  id: number;
  name: string;
  dateMonth: number;
  monthPainelContabilTotalizer: MonthPainelContabilTotalizer;
  totalizer: Totalizer[];
}

interface FinancialTableProps {
  months: Month[];
  highlightRows?: Record<number, boolean>;
  metricType?: Record<string, "PERCENT" | "VALUE">;
  isExpandedView?: boolean;
}

const HIDDEN_MONTHS_STORAGE_KEY = "balancoContabilTable.hiddenMonths";

const BalancoContabilTable = ({
  months,
  highlightRows = {},
  metricType = {},
  isExpandedView = false,
}: FinancialTableProps) => {
  const theme = useTheme();
  const [openExpandedModal, setOpenExpandedModal] = useState(false);
  const [expandedClassifications, setExpandedClassifications] = useState<
    Set<number>
  >(new Set());
  const { valueMode } = useValueDisplay();

  const monthOptions = useMemo(
    () =>
      months.map((month) => ({
        key: String(month.dateMonth ?? month.id),
        label: monthTranslatorUtil(month.name),
      })),
    [months],
  );

  const {
    hiddenMonthKeys,
    showAllMonths,
    hideAllMonths,
    toggleMonthVisibility,
  } = useMonthVisibility(HIDDEN_MONTHS_STORAGE_KEY, monthOptions);

  const visibleMonths = useMemo(() => {
    const hidden = new Set(hiddenMonthKeys);
    return months.filter(
      (month) => !hidden.has(String(month.dateMonth ?? month.id)),
    );
  }, [hiddenMonthKeys, months]);

  // Cria lista única de totalizadores
  const allTotalizers: Totalizer[] = [];
  months.forEach((month) => {
    month.totalizer.forEach((totalizer) => {
      if (!allTotalizers.some((t) => t.id === totalizer.id)) {
        allTotalizers.push(totalizer);
      }
    });
  });

  allTotalizers.sort((a, b) => a.typeOrder - b.typeOrder);

  const isEmpty = !months.length || !allTotalizers.length;
  const showEmptyState = isEmpty || visibleMonths.length === 0;

  const toggleClassification = (classificationId: number) => {
    setExpandedClassifications((prev) => {
      const next = new Set(prev);
      if (next.has(classificationId)) {
        next.delete(classificationId);
      } else {
        next.add(classificationId);
      }
      return next;
    });
  };

  const stickyCellBase = {
    position: "sticky" as const,
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    borderRight: `1px solid ${theme.palette.divider}`,
  };

  const stickyHeaderStyle = {
    position: "sticky" as const,
    top: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: 2,
  };

  const stickyHeaderFirstCellStyle = {
    ...stickyHeaderStyle,
    left: 0,
    zIndex: 3,
  };

  const formatValue = (name: string, value: number): string => {
    if (value === 0) return "-";

    const isNegative = value < 0;
    let adjustedValue = Math.abs(value);

    const isPercent = metricType[name] === "PERCENT" || name.includes("%");

    // Só aplica conversão se NÃO for percentual
    if (!isPercent) {
      if (valueMode === "MILHAR") {
        adjustedValue /= 1000;
      } else if (valueMode === "MILHARES") {
        adjustedValue /= 1000000;
      }
    }

    if (isPercent) {
      const formatted = `${adjustedValue.toFixed(2).replace(".", ",")}%`;
      return isNegative ? `(${formatted})` : formatted;
    }

    const formatted = Math.trunc(adjustedValue).toLocaleString("pt-BR");
    return isNegative ? `(${formatted})` : formatted;
  };

  const hasAnyTotalizerValue = (totId: number) => {
    return months.some((month) => {
      const monthTotalizer = month.totalizer.find((t) => t.id === totId);
      const v = monthTotalizer?.totalValue;
      return v !== undefined && v !== null && v !== 0;
    });
  };

  const hasAnyClassificationValue = (totId: number, clsId: number) => {
    return months.some((month) => {
      const monthTotalizer = month.totalizer.find((t) => t.id === totId);
      const monthClassification = monthTotalizer?.classifications?.find(
        (c) => c.id === clsId,
      );
      const v = monthClassification?.value;
      return v !== undefined && v !== null && v !== 0;
    });
  };

  const hasAnyDatas = (totId: number, clsId: number) =>
    hasAnyDatasHelper(months, totId, clsId, (month) => month.totalizer);

  const getUniqueDataNames = (
    totId: number,
    clsId: number,
  ): Array<{ name: string; costCenter?: string }> =>
    getUniqueDataNamesHelper(months, totId, clsId, (month) => month.totalizer);

  const getDataValueByNameForMonth = (
    month: Month,
    totId: number,
    clsId: number,
    dataName: string,
  ): number | undefined =>
    getDataValueByNameForMonthHelper(
      month,
      totId,
      clsId,
      dataName,
      (m) => m.totalizer,
    );

  return (
    <>
      <MonthTableControls
        monthOptions={monthOptions}
        hiddenMonthKeys={hiddenMonthKeys}
        onShowAllMonths={showAllMonths}
        onHideAllMonths={hideAllMonths}
        onToggleMonth={toggleMonthVisibility}
        onExpand={() => setOpenExpandedModal(true)}
        expandDisabled={isEmpty}
        hideExpand={isExpandedView}
      />

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxHeight: isExpandedView ? "calc(100vh - 190px)" : 600,
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
      {showEmptyState ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight={360}
          color={theme.palette.text.secondary}
          px={2}
          textAlign="center"
        >
          <ArchiveRoundedIcon
            sx={{ fontSize: 56, color: theme.palette.text.disabled, mb: 1.5 }}
          />
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Ainda não há nada para exibir
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            À medida que os cadastros forem realizados, as informações serão exibidas aqui.
          </Typography>
        </Box>
      ) : (
        <Table
          size="small"
          aria-label="financial table"
          sx={{ minWidth: 650 }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ ...stickyHeaderFirstCellStyle, minWidth: 250 }}
              />
              {visibleMonths.map((month: Month) => (
                <TableCell
                  key={month.id}
                  align="right"
                  sx={{ ...stickyHeaderStyle, minWidth: 120 }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {monthTranslatorUtil(month.name)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allTotalizers
              .filter((totalizer) => hasAnyTotalizerValue(totalizer.id))
              .map((totalizer: Totalizer) => {
                const isHighlighted = !!highlightRows[totalizer.id];
                const rowBg = isHighlighted
                  ? theme.palette.action.hover
                  : theme.palette.grey[100];

                return (
                  <React.Fragment key={totalizer.id}>
                    {/* Linha de Totalizador */}
                    <TableRow sx={{ backgroundColor: rowBg }}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          ...stickyCellBase,
                          backgroundColor: rowBg,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 220,
                        }}
                      >
                        <Tooltip
                          title={totalizer.name}
                          arrow
                          placement="top-start"
                        >
                          <Typography variant="body2" fontWeight="bold" noWrap>
                            {totalizer.name}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      {visibleMonths.map((month: Month) => {
                        const monthTotalizer = month.totalizer.find(
                          (t) => t.id === totalizer.id,
                        );
                        return (
                          <TableCell
                            key={`${month.id}-${totalizer.id}`}
                            align="right"
                            sx={{ backgroundColor: rowBg }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {monthTotalizer?.totalValue !== undefined
                                ? formatValue(
                                    monthTotalizer.name,
                                    monthTotalizer.totalValue,
                                  )
                                : "-"}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Linhas de Classificação */}
                    {totalizer.classifications
                      ?.filter((classification) =>
                        hasAnyClassificationValue(
                          totalizer.id,
                          classification.id,
                        ),
                      )
                      .map((classification: Classification) => {
                        const isExpanded = expandedClassifications.has(
                          classification.id,
                        );
                        const canExpand = hasAnyDatas(
                          totalizer.id,
                          classification.id,
                        );
                        const uniqueDataNames = isExpanded
                          ? getUniqueDataNames(totalizer.id, classification.id)
                          : [];

                        return (
                          <React.Fragment key={classification.id}>
                            {/* Linha de Classificação */}
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                  ...stickyCellBase,
                                  backgroundColor:
                                    theme.palette.background.paper,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 220,
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={0.5}
                                  sx={{ minWidth: 0 }}
                                >
                                  {canExpand ? (
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        toggleClassification(classification.id)
                                      }
                                      sx={{
                                        flexShrink: 0,
                                        width: 20,
                                        height: 20,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: "4px",
                                        p: 0,
                                        color: theme.palette.text.secondary,
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.action.hover,
                                        },
                                      }}
                                    >
                                      {isExpanded ? (
                                        <RemoveIcon sx={{ fontSize: 14 }} />
                                      ) : (
                                        <AddIcon sx={{ fontSize: 14 }} />
                                      )}
                                    </IconButton>
                                  ) : (
                                    <Box sx={{ width: 20, flexShrink: 0 }} />
                                  )}
                                  <Tooltip
                                    title={classification.name}
                                    arrow
                                    placement="top-start"
                                  >
                                    <Typography
                                      variant="body2"
                                      noWrap
                                      sx={{ minWidth: 0 }}
                                    >
                                      {classification.name}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              {visibleMonths.map((month: Month) => {
                                const monthTotalizer = month.totalizer.find(
                                  (t) => t.id === totalizer.id,
                                );
                                const monthClassification =
                                  monthTotalizer?.classifications?.find(
                                    (c) => c.id === classification.id,
                                  );

                                return (
                                  <TableCell
                                    key={`${month.id}-${classification.id}`}
                                    align="right"
                                  >
                                    <Typography variant="body2">
                                      {monthClassification
                                        ? formatValue(
                                            classification.name,
                                            monthClassification.value,
                                          )
                                        : "-"}
                                    </Typography>
                                  </TableCell>
                                );
                              })}
                            </TableRow>

                            {/* Linhas de Dados (acordeão) — uma linha por nome único, colunas por mês */}
                            {isExpanded &&
                              uniqueDataNames.map(({ name, costCenter }) => (
                                <TableRow
                                  key={`data-${classification.id}-${name}`}
                                  sx={{
                                    backgroundColor:
                                      theme.palette.action.selected,
                                  }}
                                >
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                      ...stickyCellBase,
                                      backgroundColor:
                                        theme.palette.action.selected,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: 220,
                                      pl: 5,
                                    }}
                                  >
                                    <Tooltip
                                      title={
                                        costCenter
                                          ? name : null
                                      }
                                      arrow
                                      placement="top-start"
                                    >
                                      <Typography
                                        variant="body2"
                                        noWrap
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {name}
                                      </Typography>
                                    </Tooltip>
                                  </TableCell>
                                  {visibleMonths.map((month: Month) => {
                                    const value = getDataValueByNameForMonth(
                                      month,
                                      totalizer.id,
                                      classification.id,
                                      name,
                                    );
                                    return (
                                      <TableCell
                                        key={`data-${month.id}-${classification.id}-${name}`}
                                        align="right"
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color:
                                              theme.palette.text.secondary,
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          {value !== undefined
                                            ? formatValue(name, value)
                                            : "-"}
                                        </Typography>
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })}

            {/* Total do Painel Contábil */}
            {months[0]?.monthPainelContabilTotalizer && (
              <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    ...stickyCellBase,
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {months[0].monthPainelContabilTotalizer.name}
                  </Typography>
                </TableCell>
                {visibleMonths.map((month: Month) => (
                  <TableCell key={`total-${month.id}`} align="right">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {month.monthPainelContabilTotalizer
                        ? formatValue(
                            "Totalizador",
                            month.monthPainelContabilTotalizer.totalValue,
                          )
                        : "-"}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
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
            Balanço Contábil
            <IconButton
              aria-label="Fechar tabela expandida"
              onClick={() => setOpenExpandedModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2.5, pt: 1 }}>
            <BalancoContabilTable
              months={months}
              highlightRows={highlightRows}
              metricType={metricType}
              isExpandedView
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BalancoContabilTable;
