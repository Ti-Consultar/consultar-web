import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  TableSortLabel,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Company } from "../../../types/company";
import {
  formatCNPJ,
  formatPhoneNumberSymbolized,
} from "../../../utils/formatters";
import InboxIcon from "@mui/icons-material/Inbox";
import { TableToolbar } from "./Header";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";
import { AlertModal } from "../../../components/AlertModal";

type CompanyTableProps = {
  companies: Company[];
  onAddCompany: () => void;
  onOpen: (company: Company) => void;
  onEdit: (company: Company) => void;
  onReactivate: (selectedIds: number[]) => Promise<void>;
  onDelete: (company: Company) => void;
  fileName?: string;
};

type Column<DataType> = {
  label: string;
  accessor: (item: DataType) => any;
};

export const CompanyTable = ({
  fileName,
  companies,
  onAddCompany,
  onOpen,
  onEdit,
  onDelete,
  onReactivate
}: CompanyTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (companyId: number) => {
    //navigate(`/empresas/${companyId}`);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderBy(property);
    setOrderDirection(isAsc ? "desc" : "asc");
  };

  const getValueByPath = (obj: any, path: string) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (!orderBy) return 0;
    const aValue = getValueByPath(a, orderBy);
    const bValue = getValueByPath(b, orderBy);
    return orderDirection === "asc"
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  const paginatedCompanies = sortedCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    company: Company
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompany(null);
  };

  const handleOpen = () => {
    if (selectedCompany) onOpen(selectedCompany);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedCompany) onEdit(selectedCompany);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedCompany) {
      await onDelete(selectedCompany); // <-- aguarda a exclusão
    }
    handleMenuClose();
    setOpenDialog(false);
  };

  const exportPDF = (data: any[], columns: any[]) => {
    const doc = new jsPDF();

    const head = [columns.map((col) => col.label)];
    const body = data.map((item) => columns.map((col) => col.accessor(item)));

    autoTable(doc, {
      head,
      body,
    });

    doc.save(`${fileName}-empresas.pdf`);
  };

  const exportCSV = <DataType,>(
    data: DataType[],
    columns: Column<DataType>[]
  ) => {
    const csvData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        row[col.label] = col.accessor(item);
      });
      return row;
    });

    const csv = unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}-empresas.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format: string) => {
    const columns = [
      {
        label: "CNPJ",
        accessor: (row: any) => {
          if (row.businessEntity?.cnpj)
            return formatCNPJ(row.businessEntity.cnpj);
          else return "";
        },
      },
      { label: "Nome Fantasia", accessor: (row: any) => row.companyName },
      {
        label: "Localidade",
        accessor: (row: any) =>
          `${row.businessEntity?.municipio}, ${row.businessEntity?.uf}`,
      },
      {
        label: "Email",
        accessor: (row: any) => row.businessEntity?.email || "",
      },
      {
        label: "Telefone",
        accessor: (row: any) =>
          formatPhoneNumberSymbolized(row.businessEntity?.telefone),
      },
    ];

    switch (format) {
      case "CSV":
        exportCSV(filteredCompanies, columns);
        break;
      case "PDF":
        exportPDF(filteredCompanies, columns);
        break;
      default:
        break;
    }
  };

  return (
    <TableContainer component={Paper}>
      <TableToolbar
        title="Empresas"
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setPage(0);
        }}
        onAddClick={onAddCompany}
        onExport={handleExport}
        onReactivate={onReactivate}
      />
      <Table>
        <TableHead sx={{ backgroundColor: "var(--neutral-100)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}>
              CNPJ
            </TableCell>
            <TableCell
              sortDirection={orderBy === "companyName" ? orderDirection : false}
            >
              <TableSortLabel
                active={orderBy === "companyName"}
                direction={orderBy === "companyName" ? orderDirection : "asc"}
                onClick={() => handleSort("companyName")}
                sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}
              >
                Nome Fantasia
              </TableSortLabel>
            </TableCell>
            <TableCell
              sortDirection={
                orderBy === "businessEntity.municipio" ? orderDirection : false
              }
            >
              <TableSortLabel
                active={orderBy === "businessEntity.municipio"}
                direction={
                  orderBy === "businessEntity.municipio"
                    ? orderDirection
                    : "asc"
                }
                onClick={() => handleSort("businessEntity.municipio")}
                sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}
              >
                Localidade
              </TableSortLabel>
            </TableCell>
            <TableCell
              sortDirection={
                orderBy === "businessEntity.email" ? orderDirection : false
              }
            >
              <TableSortLabel
                active={orderBy === "businessEntity.email"}
                direction={
                  orderBy === "businessEntity.email" ? orderDirection : "asc"
                }
                onClick={() => handleSort("businessEntity.email")}
                sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell
              sortDirection={
                orderBy === "businessEntity.telefone" ? orderDirection : false
              }
            >
              <TableSortLabel
                active={orderBy === "businessEntity.telefone"}
                direction={
                  orderBy === "businessEntity.telefone" ? orderDirection : "asc"
                }
                onClick={() => handleSort("businessEntity.telefone")}
                sx={{ fontWeight: "bold", color: "var(--neutral-500)" }}
              >
                Telefone
              </TableSortLabel>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  py={4}
                >
                  <InboxIcon fontSize="large" color="disabled" />
                  <Typography variant="body1" color="textSecondary">
                    Nenhuma empresa encontrada.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            paginatedCompanies.map((company) => (
              <TableRow
                key={company.companyId}
                hover
                onClick={() => handleRowClick(company.companyId)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  {formatCNPJ(company.businessEntity?.cnpj)}
                </TableCell>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{`${company.businessEntity?.municipio}, ${company.businessEntity?.uf}`}</TableCell>
                <TableCell>{company.businessEntity?.email}</TableCell>
                <TableCell>
                  {formatPhoneNumberSymbolized(
                    company.businessEntity?.telefone
                  )}
                </TableCell>
                <TableCell>
                  <MoreHorizIcon
                    onClick={(event: any) => handleMenuOpen(event, company)}
                    style={{ cursor: "pointer" }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredCompanies.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 3,
            minWidth: 150,
            p: 1,
            bgcolor: "background.paper",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem onClick={handleOpen} sx={{ display: "flex", gap: 1 }}>
          <OpenInNewRoundedIcon color="action" sx={{ fontSize: "18px" }} />
          Abrir
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ display: "flex", gap: 1 }}>
          <EditRoundedIcon
            sx={{ fontSize: "18px", color: "var(--branding-default-blue)" }}
          />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => setOpenDialog(true)}
          sx={{ display: "flex", gap: 1 }}
        >
          <DeleteRoundedIcon
            sx={{ fontSize: "18px", color: "var(--status-error-950)" }}
          />
          Excluir
        </MenuItem>
      </Menu>
      <AlertModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          handleDelete();
          setOpen(false);
        }}
        title="Excluir Empresa"
        message={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              gap: "10px",
            }}
          >
            <span>Tem certeza que deseja deletar esta empresa?</span>
            <Alert color="warning" severity="info">
              Esta ação também irá deletar todas as filiais atreladas a ela.
            </Alert>
          </div>
        }
        type="warning"
      />
    </TableContainer>
  );
};
