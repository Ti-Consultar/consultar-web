import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { useState } from "react";
import { Balancetes } from "../../../types/balancete";

interface AccountingTableProps {
  data: Balancetes;
  onRowClick?: (id: number) => void;
}

type Order = "asc" | "desc";

export const AccountingTable = ({ data, onRowClick }: AccountingTableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<"dateYear" | "dateMonth" | "status">(
    "dateYear"
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const monthMap: Record<string, string> = {
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

  const formatDate = (month: string, year: number) => {
    const translatedMonth = monthMap[month] || month;
    return `${translatedMonth} de ${year}`;
  };

  const handleRequestSort = (property: typeof orderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === "desc"
      ? (a, b) =>
          b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0
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

  const sortedData = stableSort(data.balancetes, getComparator(order, orderBy));
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid var(--neutral-200)" }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: "var(--neutral-100)" }}>
            <TableRow>
              <TableCell
                sortDirection={orderBy === "dateMonth" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "dateMonth"}
                  direction={orderBy === "dateMonth" ? order : "asc"}
                  onClick={() => handleRequestSort("dateMonth")}
                >
                  <strong style={{ color: "var(--neutral-500)" }}>
                    Data do balancete
                  </strong>
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "status" ? order : false}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  <span style={{ color: "var(--neutral-500)" }}>Status</span>
                </TableSortLabel>
              </TableCell>
              {/* <TableCell align="center" sx={{ color: "var(--neutral-500)" }}>
                Ações
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 5, color: "var(--neutral-400)" }}
                >
                  Nenhum balancete encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(({ id, dateMonth, dateYear, status }) => (
                <TableRow
                  key={id}
                  hover
                  onClick={() => onRowClick?.(id)}
                  sx={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  <TableCell
                    sx={{ fontWeight: 550, color: "var(--neutral-500)" }}
                  >
                    {formatDate(dateMonth, dateYear)}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 550, color: "var(--neutral-500)" }}
                  >
                    <Chip label={status} color="warning" variant="outlined" />
                  </TableCell>
                  {/* <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // impede o clique na linha
                        onRowClick?.(id);
                      }}
                      color="primary"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        sx={{
          alignSelf: "flex-end",
          overflow: "hidden",
        }}
        count={data.balancetes.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Itens por página"
        rowsPerPageOptions={[5, 10, 25]}
      />
    </>
  );
};
