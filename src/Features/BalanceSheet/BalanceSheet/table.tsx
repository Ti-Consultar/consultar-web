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

  const allTotalizers: Totalizer[] = [];
  months.forEach((month) => {
    month.totalizer.forEach((totalizer) => {
      if (!allTotalizers.some((t) => t.id === totalizer.id)) {
        allTotalizers.push(totalizer);
      }
    });
  });

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

  allTotalizers.sort((a, b) => a.typeOrder - b.typeOrder);

  const isEmpty = !months.length || !allTotalizers.length;

  const stickyCellStyle = {
    position: "sticky",
    left: 0,
    backgroundColor: "white",
    zIndex: 10,
    borderRight: `1px solid ${theme.palette.divider}`,
  };

  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: "#DDE4EB",
    zIndex: 11,
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
            <InboxIcon sx={{ fontSize: 48, color: "var(--neutral-400)" }} />
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
                  sx={{
                    ...stickyCellStyle,
                    ...stickyHeaderStyle,
                    minWidth: 250,
                  }}
                ></TableCell>
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
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor: theme.palette.grey[100],
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ ...stickyCellStyle }}
                    >
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
                            {monthTotalizer
                              ? monthTotalizer.totalValue === 0
                                ? "-"
                                : Math.trunc(
                                    monthTotalizer.totalValue / 1000
                                  ).toLocaleString("pt-BR")
                              : "-"}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {totalizer.classifications?.map(
                    (classification: Classification) => (
                      <TableRow
                        key={classification.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
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
                                  ? monthClassification.value === 0
                                    ? "-"
                                    : Math.trunc(
                                        monthClassification.value / 1000
                                      ).toLocaleString("pt-BR")
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

              {months[0]?.monthPainelContabilTotalizer && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ ...stickyCellStyle }}
                  >
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
                        {month.monthPainelContabilTotalizer.totalValue === 0
                          ? "-"
                          : Math.trunc(
                              month.monthPainelContabilTotalizer.totalValue /
                                1000
                            ).toLocaleString("pt-BR")}
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
