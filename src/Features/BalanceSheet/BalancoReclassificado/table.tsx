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
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";

// Tipagens
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
}

const BalancoReclassificadoTable = ({ months }: FinancialTableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();

  // Estados para modal e dados selecionados
  const [openModal, setOpenModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedClassifications, setSelectedClassifications] = useState<
    Classification[]
  >([]);

  // Lista única de totalizadores
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

  // Tradutor de meses
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

  // Formata valores conforme modo
  const formatValue = (classificationName: string, value: number): string => {
    if (value === 0) return "-";
    let adjustedValue = Math.abs(value);

    if (valueMode === "MILHAR") adjustedValue /= 1000;
    else if (valueMode === "MILHARES") adjustedValue /= 1000000;

    if (classificationName.includes("%"))
      return `${adjustedValue.toFixed(2).replace(".", ",")}%`;

    if (classificationName.startsWith("(-)"))
      return `(${Math.trunc(adjustedValue).toLocaleString("pt-BR")})`;

    return Math.trunc(adjustedValue).toLocaleString("pt-BR");
  };

  // Estilos sticky para primeira coluna e cabeçalho
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

  // Função para abrir modal com classifications do totalizador clicado em um mês específico
  const handleTotalizerClick = (totalizer: Totalizer, month: Month) => {
    const monthTotalizer = month.totalizer.find((t) => t.id === totalizer.id);
    if (monthTotalizer?.classifications?.length) {
      setSelectedTitle(`${totalizer.name} - ${monthTranslator(month.name)}`);
      setSelectedClassifications(monthTotalizer.classifications);
      setOpenModal(true);
    }
  };

  // Função para pegar classifications únicas, para exibir as linhas abaixo do totalizador
  const getUniqueClassifications = (
    months: Month[],
    totalizerId: number
  ): Classification[] => {
    const map = new Map<number, Classification>();
    months.forEach((month) => {
      const monthTotalizer = month.totalizer.find((t) => t.id === totalizerId);
      monthTotalizer?.classifications?.forEach((classification) => {
        if (!map.has(classification.id)) {
          map.set(classification.id, classification);
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.typeOrder - b.typeOrder);
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
                {months.map((month) => (
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
              {allTotalizers.map((totalizer) => (
                <React.Fragment key={totalizer.id}>
                  {/* Linha do Totalizador */}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={stickyCellStyle}>
                      <Typography variant="body2">
                        {totalizer.name}
                      </Typography>
                    </TableCell>
                    {months.map((month) => {
                      const monthTotalizer = month.totalizer.find(
                        (t) => t.id === totalizer.id
                      );
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
                              backgroundColor: monthTotalizer?.classifications
                                ?.length
                                ? theme.palette.action.hover
                                : "inherit",
                            },
                          }}
                        >
                          <Typography variant="body2" fontFamily="monospace">
                            {monthTotalizer?.totalValue
                              ? formatValue(
                                  monthTotalizer.name,
                                  monthTotalizer.totalValue
                                )
                              : "-"}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Linhas das Classificações */}
    
                </React.Fragment>
              ))}

              {/* Total Painel Contábil */}
              {months[0]?.monthPainelContabilTotalizer && (
                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                  <TableCell component="th" scope="row" sx={stickyCellStyle}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {months[0].monthPainelContabilTotalizer.name}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={`total-${month.id}`} align="right">
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {formatValue(
                          "Totalizador",
                          month.monthPainelContabilTotalizer.totalValue
                        )}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Modal que mostra as classifications do totalizador clicado */}
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
