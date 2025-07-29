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
} from "@mui/material";
import { TableDetailModal } from "./tableDetail";
import InboxIcon from "@mui/icons-material/Inbox";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";

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
}

const BalancoContabilTable = ({ months }: FinancialTableProps) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState<FinancialData[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const { valueMode } = useValueDisplay();

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

  // Tradutor de mês
  function monthTranslator(mesIngles: string): string {
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
  }

  // Modal
  const handleCellClick = (
    datas: FinancialData[] | undefined,
    title: string
  ) => {
    if (datas && datas.length > 0) {
      setSelectedData(datas);
      setSelectedTitle(title);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedData([]);
    setSelectedTitle("");
  };

  // Estilos Sticky
  const stickyCellStyle = {
    position: "sticky",
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    borderRight: `1px solid ${theme.palette.divider}`,
  };

  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: 11,
  };

  const stickyHeaderFirstCellStyle = {
    ...stickyHeaderStyle,
    left: 0,
    zIndex: 12,
  };

  const formatValue = (classificationName: string, value: number): string => {
    if (value === 0) return "-";

    let adjustedValue = Math.abs(value); // Remove sinal negativo sempre

    // Ajuste com base no modo selecionado
    if (valueMode === "MILHAR") {
      adjustedValue = adjustedValue / 1000;
    } else if (valueMode === "MILHARES") {
      adjustedValue = adjustedValue / 1000000;
    }

    // Caso porcentagem
    if (classificationName.includes("%")) {
      return `${adjustedValue.toFixed(2).replace(".", ",")}%`;
    }

    // Caso negativo contábil com parênteses
    if (classificationName.startsWith("(-)")) {
      return `(${Math.trunc(adjustedValue).toLocaleString("pt-BR")})`;
    }

    // Caso normal
    return Math.trunc(adjustedValue).toLocaleString("pt-BR");
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
                />
                {months.map((month: Month) => (
                  <TableCell
                    key={month.id}
                    align="right"
                    sx={{ ...stickyHeaderStyle, minWidth: 120 }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {monthTranslator(month.name)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allTotalizers.map((totalizer: Totalizer) => (
                <React.Fragment key={totalizer.id}>
                  {/* Linha de Totalizador */}
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor: theme.palette.grey[100],
                    }}
                  >
                    <TableCell component="th" scope="row" sx={stickyCellStyle}>
                      <Typography variant="body2" fontWeight="bold">
                        {totalizer.name}
                      </Typography>
                    </TableCell>
                    {months.map((month: Month) => {
                      const monthTotalizer = month.totalizer.find(
                        (t) => t.id === totalizer.id
                      );
                      return (
                        <TableCell
                          key={`${month.id}-${totalizer.id}`}
                          align="right"
                        >
                          <Typography variant="body2" fontFamily="monospace">
                            {monthTotalizer?.totalValue
                              ? formatValue(
                                  monthTotalizer.name,
                                  monthTotalizer?.totalValue
                                )
                              : "-"}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Linhas de Classificação */}
                  {totalizer.classifications?.map(
                    (classification: Classification) => (
                      <TableRow key={classification.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ pl: 4, ...stickyCellStyle }}
                        >
                          <Typography variant="body2">
                            {classification.name}
                          </Typography>
                        </TableCell>
                        {months.map((month: Month) => {
                          const monthTotalizer = month.totalizer.find(
                            (t) => t.id === totalizer.id
                          );
                          const monthClassification =
                            monthTotalizer?.classifications?.find(
                              (c) => c.id === classification.id
                            );
                          return (
                            <TableCell
                              key={`${month.id}-${classification.id}`}
                              align="right"
                              onClick={() =>
                                handleCellClick(
                                  monthClassification?.datas,
                                  `${classification.name} - ${monthTranslator(
                                    month.name
                                  )}`
                                )
                              }
                              sx={{
                                cursor: monthClassification?.datas?.length
                                  ? "pointer"
                                  : "default",
                                "&:hover": {
                                  backgroundColor: monthClassification?.datas
                                    ?.length
                                    ? theme.palette.action.hover
                                    : "inherit",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontFamily="monospace"
                              >
                                {monthClassification
                                  ? formatValue(
                                      classification.name,
                                      monthClassification.value
                                    )
                                  : "-"}
                              </Typography>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    )
                  )}
                </React.Fragment>
              ))}

              {/* Total do Painel Contábil */}
              {months[0]?.monthPainelContabilTotalizer && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  <TableCell component="th" scope="row" sx={stickyCellStyle}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {months[0].monthPainelContabilTotalizer.name}
                    </Typography>
                  </TableCell>
                  {months.map((month: Month) => (
                    <TableCell key={`total-${month.id}`} align="right">
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {month.monthPainelContabilTotalizer
                          ? formatValue(
                              "Totalizador",
                              month.monthPainelContabilTotalizer.totalValue
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

      <TableDetailModal
        handleCloseModal={handleCloseModal}
        openModal={openModal}
        selectedData={selectedData}
        selectedTitle={selectedTitle}
      />
    </>
  );
};

export default BalancoContabilTable;
