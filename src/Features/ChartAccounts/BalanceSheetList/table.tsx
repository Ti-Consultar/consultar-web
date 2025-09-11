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
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { Balancetes } from "../../../types/balancete";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

interface AccountingTableProps {
  data: Balancetes;
  onRowClick?: (id: number) => void;
  onDelete?: (id: number) => void;
}

type Order = "asc" | "desc";

export const AccountingTable = ({
  data,
  onRowClick,
  onDelete,
}: AccountingTableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<"dateYear" | "dateMonth" | "status">(
    "dateYear"
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  function stableSort<T>(
    array: (T | null | undefined)[] | undefined,
    comparator: (a: T, b: T) => number
  ): T[] {
    if (!Array.isArray(array)) return [];

    const stabilized = array
      .map((el, index) => [el, index] as const)
      .sort((a, b) => {
        const elA = a[0];
        const elB = b[0];

        if (elA == null && elB == null) return a[1] - b[1];
        if (elA == null) return 1;
        if (elB == null) return -1;

        const cmp = comparator(elA, elB);
        return cmp !== 0 ? cmp : a[1] - b[1];
      });

    return stabilized.map(([el]) => el as T);
  }

  const sortedData = stableSort(
    data?.balancetes ?? [],
    getComparator(order, orderBy)
  );
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
                    Referência
                  </strong>
                </TableSortLabel>
              </TableCell>
              {!isMobile && (
                <TableCell sortDirection={orderBy === "status" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    <strong style={{ color: "var(--neutral-500)" }}>
                      Status
                    </strong>
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell sortDirection={orderBy === "status" ? order : false}>
                <strong style={{ color: "var(--neutral-500)" }}>
                  Data do Envio
                </strong>
              </TableCell>
              <TableCell align="center" sx={{ color: "var(--neutral-500)" }}>
                Ações
              </TableCell>
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
              paginatedData.map(({ id, dateMonth, dateYear, dateCreate }) => (
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
                  {!isMobile && (
                    <TableCell
                      sx={{ fontWeight: 550, color: "var(--neutral-500)" }}
                    >
                      <Chip
                        label={"enviado"}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: 550, color: "var(--neutral-500)" }}
                  >
                    {dayjs(dateCreate).format("D [de] MMMM [de] YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Excluir balancete">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(id);
                        }}
                        color="error"
                      >
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
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
        count={data?.balancetes?.length ?? 0}
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
