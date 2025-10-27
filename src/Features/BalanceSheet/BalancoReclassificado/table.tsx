import React, { useState } from "react";
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
  budgetMonths?: Month[];
  variationMonths?: Month[];
  showBudgetColumns?: boolean;
  highlightRows?: Record<number, boolean>;
}

const BalancoReclassificadoTable = ({
  months,
  budgetMonths = [],
  variationMonths = [],
  showBudgetColumns = false,
  highlightRows = {},
}: FinancialTableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedClassifications, setSelectedClassifications] = useState<
    Classification[]
  >([]);

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

  const monthTranslator = (mesIngles: string): string => {
    const meses: Record<string, string> = {
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
    return meses[mesIngles] || mesIngles;
  };

  const formatValue = (classificationName: string, value: number): string => {
    if (value === 0 || value === undefined || value === null) return "-";
    let adjustedValue = Math.abs(value);

    if (valueMode === "MILHAR") adjustedValue /= 1000;
    else if (valueMode === "MILHARES") adjustedValue /= 1000000;

    if (classificationName.includes("%")) {
      const formatted = adjustedValue.toFixed(2).replace(".", ",");
      return value < 0 ? `(${formatted}%)` : `${formatted}%`;
    }

    const formattedNumber = Math.trunc(adjustedValue).toLocaleString("pt-BR");
    return value < 0 ? `(${formattedNumber})` : formattedNumber;
  };

  const stickyCellBase = {
    position: "sticky" as const,
    left: 0,
    borderRight: `1px solid ${theme.palette.divider}`,
    zIndex: 2,
  };

  const stickyHeaderStyle = {
    position: "sticky" as const,
    top: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: 3,
  };

  const stickyHeaderFirstCellStyle = {
    ...stickyHeaderStyle,
    left: 0,
    zIndex: 4,
  };

  const handleTotalizerClick = (totalizer: Totalizer, month: Month) => {
    const monthTotalizer = month.totalizer.find((t) => t.id === totalizer.id);
    if (monthTotalizer?.classifications?.length) {
      setSelectedTitle(`${totalizer.name} - ${monthTranslator(month.name)}`);
      setSelectedClassifications(monthTotalizer.classifications);
      setOpenModal(true);
    }
  };

  const renderValueCells = (month: Month, totalizer: Totalizer) => {
    const monthTotalizer = month.totalizer.find((t) => t.id === totalizer.id);
    const realValue =
      typeof monthTotalizer?.totalValue === "number"
        ? formatValue(monthTotalizer.name, monthTotalizer.totalValue)
        : "-";

    if (!showBudgetColumns) {
      return (
        <TableCell
          key={`${month.id}-${totalizer.id}`}
          align="right"
          onClick={() => handleTotalizerClick(totalizer, month)}
          sx={{
            cursor: monthTotalizer?.classifications?.length
              ? "pointer"
              : "default",
            "&:hover": {
              backgroundColor: monthTotalizer?.classifications?.length
                ? theme.palette.action.hover
                : undefined,
            },
          }}
        >
          {realValue}
        </TableCell>
      );
    }

    const budgetMonth = budgetMonths.find((m) => m.id === month.id);
    const variationMonth = variationMonths.find((m) => m.id === month.id);

    const budgetValueRaw = budgetMonth?.totalizer.find(
      (t) => t.id === totalizer.id
    )?.totalValue;
    const variationValueRaw = variationMonth?.totalizer.find(
      (t) => t.id === totalizer.id
    )?.totalValue;

    const budgetValue =
      typeof budgetValueRaw === "number"
        ? formatValue(totalizer.name, budgetValueRaw)
        : "-";
    const variationValue =
      typeof variationValueRaw === "number"
        ? formatValue(totalizer.name, variationValueRaw)
        : "-";

    return (
      <>
        <TableCell
          key={`${month.id}-${totalizer.id}-real`}
          align="right"
          onClick={() => handleTotalizerClick(totalizer, month)}
          sx={{
            cursor: monthTotalizer?.classifications?.length
              ? "pointer"
              : "default",
            "&:hover": {
              backgroundColor: monthTotalizer?.classifications?.length
                ? theme.palette.action.hover
                : undefined,
            },
          }}
        >
          {realValue}
        </TableCell>
        <TableCell key={`${month.id}-${totalizer.id}-budget`} align="right">
          {budgetValue}
        </TableCell>
        <TableCell key={`${month.id}-${totalizer.id}-var`} align="right">
          {variationValue}
        </TableCell>
      </>
    );
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          maxHeight: 600,
          overflow: "auto",
          width: "100%",
        }}
      >
        {isEmpty ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={200}
            color={theme.palette.text.secondary}
            px={2}
            textAlign="center"
          >
            <InboxIcon
              sx={{ fontSize: 48, color: theme.palette.text.disabled }}
            />
            <Typography variant="subtitle1" fontWeight="medium">
              Nada a exibir ainda
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selecione uma data válida para acessar os dados
            </Typography>
          </Box>
        ) : (
          <Table size="small" aria-label="financial table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ ...stickyHeaderFirstCellStyle, minWidth: 250 }}
                >
                  Conta / Totalizador
                </TableCell>
                {months.map((month) => (
                  <TableCell
                    key={month.id}
                    align="center"
                    colSpan={showBudgetColumns ? 3 : 1}
                    sx={{ ...stickyHeaderStyle, minWidth: 120 }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {monthTranslator(month.name)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {showBudgetColumns && (
                <TableRow>
                  <TableCell sx={{ ...stickyHeaderFirstCellStyle }} />
                  {months.map((month) => (
                    <React.Fragment key={`${month.id}-sub`}>
                      <TableCell align="right">
                        <b>Realizado</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Orçado</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Variação</b>
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {allTotalizers.map((totalizer) => {
                const isHighlighted = highlightRows[totalizer.id] || false;
                const rowBg = isHighlighted ? theme.palette.grey[300] : "#fff";

                return (
                  <TableRow key={totalizer.id} sx={{ backgroundColor: rowBg }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        ...stickyCellBase,
                        backgroundColor: rowBg,
                        fontWeight: isHighlighted ? "bold" : "normal",
                        maxWidth: 220,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Tooltip
                        title={totalizer.name}
                        arrow
                        placement="top-start"
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isHighlighted ? "bold" : "normal"}
                          noWrap
                        >
                          {totalizer.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {months.map((month) => renderValueCells(month, totalizer))}
                  </TableRow>
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

                  {months.map((month) => {
                    const total = month.monthPainelContabilTotalizer.totalValue;
                    const budgetMonth = budgetMonths.find(
                      (m) => m.id === month.id
                    );
                    const variationMonth = variationMonths.find(
                      (m) => m.id === month.id
                    );

                    const budgetTotal =
                      budgetMonth?.monthPainelContabilTotalizer?.totalValue;
                    const variationTotal =
                      variationMonth?.monthPainelContabilTotalizer?.totalValue;

                    return !showBudgetColumns ? (
                      <TableCell key={`total-${month.id}`} align="right">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatValue("Totalizador", total)}
                        </Typography>
                      </TableCell>
                    ) : (
                      <React.Fragment key={`total-${month.id}`}>
                        <TableCell align="right">
                          <Typography variant="subtitle2" fontWeight="bold">
                            {formatValue("Totalizador", total)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" fontWeight="bold">
                            {budgetTotal
                              ? formatValue("Totalizador", budgetTotal)
                              : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" fontWeight="bold">
                            {variationTotal
                              ? formatValue("Totalizador", variationTotal)
                              : "-"}
                          </Typography>
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedTitle}</DialogTitle>
        <DialogContent dividers>
          <Table size="small" aria-label="Classifications Details">
            <TableHead>
              <TableRow>
                <TableCell>Classificação</TableCell>
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedClassifications.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell align="right">
                    {formatValue(c.name, c.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BalancoReclassificadoTable;
