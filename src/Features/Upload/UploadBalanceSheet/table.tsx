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
  Box,
  Button,
} from "@mui/material";
import { useState, useMemo } from "react";
import { Balancete, Balancetes } from "../../../types/balancete";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ModernTextField } from "../../../styles/DatePicker";

dayjs.locale("pt-br");

interface AccountingTableProps {
  data: Balancetes;
  onRowClick?: (balancete: Balancete) => void;
  onDelete?: (id: number) => void;
  hasBalanceSheets?: boolean;
  onEditConfig: () => void;
}

type Order = "asc" | "desc";

export const BalanceSheetUploadTable = ({
  data,
  onRowClick,
  onDelete,
  onEditConfig,
  hasBalanceSheets = false,
}: AccountingTableProps) => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<"dateMonth" | "status" | "dateYear">(
    "dateMonth"
  );

  const [filterYear, setFilterYear] = useState<Dayjs | null>(null);

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

  const comparator = (a: any, b: any) => {
    if (orderBy === "dateMonth") {
      const dateA = a.dateYear * 100 + a.dateMonth;
      const dateB = b.dateYear * 100 + b.dateMonth;
      return order === "desc" ? dateB - dateA : dateA - dateB;
    }

    // fallback para outros campos
    const valA = a[orderBy];
    const valB = b[orderBy];

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  };

  const filteredData = useMemo(() => {
    if (!filterYear) return data?.balancetes ?? [];

    const year = filterYear.year();
    return (data?.balancetes ?? []).filter((item) => item.dateYear === year);
  }, [data, filterYear]);

  const sortedData = [...filteredData].sort(comparator);

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          mb: 2,
          mr: 0,
          gap: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filtrar por ano"
            views={["year"]}
            value={filterYear}
            onChange={(v) => {
              setFilterYear(v);
              setPage(0);
            }}
            enableAccessibleFieldDOMStructure={false}
            slots={{
              textField: ModernTextField,
            }}
            slotProps={{
              textField: { size: "medium" },
            }}
          />
        </LocalizationProvider>
        {hasBalanceSheets && (
          <Button
            color="info"
            onClick={onEditConfig}
            disableElevation
            sx={{
              textTransform: "none",
            }}
            variant="contained"
          >
            Gerenciar Colunas
          </Button>
        )}
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid var(--neutral-200)", borderRadius: 2 }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: "var(--neutral-100)" }}>
            <TableRow>
              <TableCell
                sortDirection={orderBy === "dateMonth" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "dateMonth"}
                  direction={orderBy === "dateMonth" ? order : "desc"}
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

              <TableCell>
                <strong style={{ color: "var(--neutral-500)" }}>
                  Data do envio
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
                  colSpan={4}
                  align="center"
                  sx={{ py: 5, color: "var(--neutral-400)" }}
                >
                  Nenhum balancete encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((balancete) => {
                const { id, dateMonth, dateYear, dateCreate } = balancete;

                return (
                  <TableRow
                    key={id}
                    hover
                    onClick={() => onRowClick?.(balancete)}
                    sx={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    <TableCell
                      sx={{ fontWeight: 550, color: "var(--neutral-500)" }}
                    >
                      {formatDate(dateMonth, dateYear)}
                    </TableCell>

                    {!isMobile && (
                      <TableCell>
                        <Chip
                          label={"enviado"}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                    )}

                    <TableCell
                      sx={{
                        fontWeight: 550,
                        color: "var(--neutral-500)",
                      }}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        sx={{ alignSelf: "flex-end", overflow: "hidden" }}
        count={sortedData.length}
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
