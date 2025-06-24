import React, { useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Stack,
  TableSortLabel,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import { formatCNPJ } from "../../../utils/formatters";
import InboxIcon from "@mui/icons-material/Inbox";
import SearchIcon from "@mui/icons-material/Search";
import { EmptyStateBox, ModalBox, SearchInput } from "./styles";

export interface InactiveCompany {
  id: number;
  nome: string;
  cnpj: string;
}

interface InactiveCompaniesModalProps {
  open: boolean;
  onClose: () => void;
  onReactivate: (selectedIds: number[]) => void;
  inactiveCompanies: InactiveCompany[];
}

type Order = "asc" | "desc";

export const InactiveCompaniesModal: React.FC<InactiveCompaniesModalProps> = ({
  open,
  onClose,
  onReactivate,
  inactiveCompanies,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof InactiveCompany>("nome");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? visibleRows.map((c) => c.id) : []);
  };

  const handleReactivate = () => {
    onReactivate(selected);
    setSelected([]);
    onClose();
  };

  const filteredRows = (inactiveCompanies || []).filter((company) => {
    const search = searchTerm?.toLowerCase() || "";
  
    const nome = company.nome?.toLowerCase() || "";
    const cnpj = company.cnpj?.toLowerCase() || "";
  
    return nome.includes(search) || cnpj.includes(search);
  });

  const handleRequestSort = (property: keyof InactiveCompany) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortRows = (array: InactiveCompany[]) => {
    const value = (v: string | number) => v?.toString().toLowerCase() || "";
    return array.slice().sort((a, b) => {
      const valueA = value(a[orderBy]);
      const valueB = value(b[orderBy]);
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedRows = sortRows(filteredRows);
  const visibleRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const allSelected =
    selected.length > 0 && selected.length === visibleRows.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <Typography
          variant="h6"
          mb={2}
          sx={{ fontWeight: 600, color: "var(--neutral-500)" }}
        >
          Empresas Inativadas
        </Typography>
        <SearchInput
          size="small"
          placeholder="Pesquisar..."
          value={searchTerm}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#98A2B3" }} />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer component={Paper} sx={{ borderRadius: 1, mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sortDirection={orderBy === "nome" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "nome"}
                    direction={orderBy === "nome" ? order : "asc"}
                    onClick={() => handleRequestSort("nome")}
                  >
                    <Typography
                      sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}
                    >
                      Empresa
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "cnpj" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "cnpj"}
                    direction={orderBy === "cnpj" ? order : "asc"}
                    onClick={() => handleRequestSort("cnpj")}
                  >
                    <Typography
                      sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}
                    >
                      CNPJ
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <EmptyStateBox>
                      <InboxIcon fontSize="large" color="disabled" />
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Você não possui empresas inativadas.
                      </Typography>
                    </EmptyStateBox>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((company) => (
                  <TableRow
                    key={company.id}
                    hover
                    selected={selected.includes(company.id)}
                    sx={{
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(company.id)}
                        onChange={() => {handleSelect(company.id)}}
                      />
                    </TableCell>
                    <TableCell>{company.nome}</TableCell>
                    <TableCell>{formatCNPJ(company.cnpj)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Linhas por página:"
          sx={{ mt: 2 }}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleReactivate}
            variant="contained"
            color="primary"
            disabled={selected.length === 0}
          >
            Reativar
          </Button>
        </Stack>
      </ModalBox>
    </Modal>
  );
};
