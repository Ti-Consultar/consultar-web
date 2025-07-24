import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
  Button,
} from "@mui/material";
import { useState } from "react";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import InboxIcon from "@mui/icons-material/Inbox";

interface AccountLine {
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
  budgetedAmount: boolean;
}

interface BalanceSheetDetailsTableProps {
  data: AccountLine[];
  onViewDetailed: () => void;
  onViewBalanceSheet: () => void;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export const BalanceSheetDetailsTable = ({
  data,
  onViewDetailed,
  onViewBalanceSheet
}: BalanceSheetDetailsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getValueCell = (value: number) => (
    <Typography
      sx={{
        color: value < 0 ? "error.main" : "inherit",
        fontWeight: 500,
      }}
    >
      {currencyFormatter.format(value)}
    </Typography>
  );

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <InboxIcon sx={{ fontSize: 48, color: "var(--neutral-400)" }} />
        <Typography variant="h6" mt={2} color="text.secondary">
          Nenhum dado encontrado.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Não há dados de balancete para esta data.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Box display="flex" alignItems="flex-end" mb={2} sx={{ width: "100%", gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#5C57F4",
          }}
          startIcon={<TableRowsRoundedIcon />}
          onClick={onViewBalanceSheet}
          disableElevation
        >
          Balanço Contábil
        </Button>
        <Button
          variant="outlined"
          onClick={onViewDetailed}
          startIcon={<BarChartRoundedIcon />}
        >
          Ver Balanço Detalhado
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid var(--neutral-200)" }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: "var(--neutral-100)" }}>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Conta
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Nome da Conta
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Valor Inicial
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Crédito
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Débito
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Valor Final
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 5, color: "gray" }}
                >
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(
                ({
                  costCenter,
                  name,
                  initialValue,
                  credit,
                  debit,
                  finalValue,
                }) => (
                  <TableRow key={`${costCenter}-${name}`}>
                    <TableCell>{costCenter}</TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{name}</Typography>
                    </TableCell>
                    <TableCell>{getValueCell(initialValue)}</TableCell>
                    <TableCell>{currencyFormatter.format(credit)}</TableCell>
                    <TableCell>{currencyFormatter.format(debit)}</TableCell>
                    <TableCell>{getValueCell(finalValue)}</TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 1 }}
        />
      </TableContainer>
    </>
  );
};
