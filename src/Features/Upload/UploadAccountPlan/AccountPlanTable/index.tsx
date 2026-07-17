import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { TableEmptyState } from "../../../../components/TableControls/MonthTableControls";
import { SearchInput } from "../../../../components/Inputs/SearchInput";
import { PaginatedAccountPlanAccounts } from "../../../../services/apis/routes/accountplan.service";

interface AccountPlanTableProps {
  data: PaginatedAccountPlanAccounts | null;
  hasAccountPlan: boolean;
  origin?: string;
  search: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onPaginationChange: (skip: number, take: number) => void;
}

const getOriginLabel = (origin?: string) => {
  if (origin === "ExcelUpload") return "Plano de Contas";
  if (origin === "BalanceteImport") return "Balancete";
  return origin || "Não informada";
};

export const AccountPlanTable = ({
  data,
  hasAccountPlan,
  origin: accountPlanOrigin,
  search,
  loading,
  error,
  onRetry,
  onSearchChange,
  onPaginationChange,
}: AccountPlanTableProps) => {
  const totalCount = data?.totalCount ?? 0;
  const take = data?.take ?? 50;
  const skip = data?.skip ?? 0;
  const page = take > 0 ? Math.floor(skip / take) : 0;
  const origin = data?.accounts[0]?.origin || accountPlanOrigin;

  if (loading && !data) {
    return (
      <Box
        minHeight={360}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Tentar novamente
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if ((!data || totalCount === 0) && !hasAccountPlan) {
    return <TableEmptyState />;
  }

  return (
    <Box minWidth={0}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mb={2}
        flexWrap="wrap"
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Origem
          </Typography>
          <Typography color="text.primary" fontWeight={600}>
            {getOriginLabel(origin)}
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          width={{ xs: "100%", sm: "auto" }}
        >
          <Box width={{ xs: "100%", sm: 360 }}>
            <SearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Pesquisar por conta ou descrição"
              fullWidth
            />
          </Box>
          {loading && (
            <CircularProgress size={22} aria-label="Atualizando tabela" />
          )}
        </Box>
      </Box>

      {totalCount === 0 ? (
        <TableEmptyState />
      ) : (
        <>
          <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          border: "1px solid var(--neutral-200)",
          borderRadius: 2,
        }}
      >
        <Table stickyHeader sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: "28%",
                  bgcolor: "var(--neutral-100)",
                  color: "var(--neutral-500)",
                  fontWeight: 700,
                }}
              >
                Conta
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: "var(--neutral-100)",
                  color: "var(--neutral-500)",
                  fontWeight: 700,
                }}
              >
                Descrição
              </TableCell>
              <TableCell
                sx={{
                  width: 190,
                  bgcolor: "var(--neutral-100)",
                  color: "var(--neutral-500)",
                  fontWeight: 700,
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(data?.accounts ?? []).map((account) => {
              const isClassified =
                account.classificationStatus === "Classified";

              return (
                <TableRow key={account.id} hover>
                  <TableCell
                    sx={{
                      color: "var(--neutral-600)",
                      fontWeight: 600,
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={account.costCenter}
                  >
                    {account.costCenter}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--neutral-600)",
                      maxWidth: 520,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={account.name}
                  >
                    {account.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={isClassified ? "Classificada" : "Não classificada"}
                      sx={{
                        fontWeight: 600,
                        color: isClassified
                          ? "var(--status-success-950)"
                          : "#535353",
                        bgcolor: isClassified
                          ? "var(--status-success-100)"
                          : "#e6e6e6",
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
          </TableContainer>

          <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={take}
        onPageChange={(_, newPage) => onPaginationChange(newPage * take, take)}
        onRowsPerPageChange={(event) =>
          onPaginationChange(0, Number(event.target.value))
        }
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Itens por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        sx={{
          overflow: "hidden",
          ".MuiTablePagination-toolbar": { flexWrap: "wrap" },
        }}
          />
        </>
      )}
    </Box>
  );
};
