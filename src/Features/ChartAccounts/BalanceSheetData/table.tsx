import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
  TablePagination,
  Box,
  Button,
} from "@mui/material";
import { useState } from "react";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
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
}

type Order = "asc" | "desc";
type OrderBy = keyof Pick<
  AccountLine,
  "initialValue" | "credit" | "debit" | "finalValue"
>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
    : (a, b) =>
        a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as const);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    return cmp !== 0 ? cmp : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

export const BalanceSheetDetailsTable = ({
  data,
  onViewDetailed,
}: BalanceSheetDetailsTableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("finalValue");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = stableSort(
    [...data].sort((a, b) => Number(a.costCenter) - Number(b.costCenter)),
    getComparator(order, orderBy)
  );

  const paginatedData = sortedData.slice(
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
        <InboxIcon
          sx={{ fontSize: 48, color: "var(--neutral-400)" }}
        />
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
      <Box display="flex" alignItems="flex-end" mb={2} sx={{ width: "100%" }}>
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
                  Centro de Custo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="var(--neutral-500)">
                  Nome da Conta
                </Typography>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "initialValue" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "initialValue"}
                  direction={order}
                  onClick={() => handleRequestSort("initialValue")}
                >
                  <Typography variant="subtitle2" color="var(--neutral-500)">
                    Valor Inicial
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "credit" ? order : false}>
                <TableSortLabel
                  active={orderBy === "credit"}
                  direction={order}
                  onClick={() => handleRequestSort("credit")}
                >
                  <Typography variant="subtitle2" color="var(--neutral-500)">
                    Crédito
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "debit" ? order : false}>
                <TableSortLabel
                  active={orderBy === "debit"}
                  direction={order}
                  onClick={() => handleRequestSort("debit")}
                >
                  <Typography variant="subtitle2" color="var(--neutral-500)">
                    Débito
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "finalValue" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "finalValue"}
                  direction={order}
                  onClick={() => handleRequestSort("finalValue")}
                >
                  <Typography variant="subtitle2" color="var(--neutral-500)">
                    Valor Final
                  </Typography>
                </TableSortLabel>
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
