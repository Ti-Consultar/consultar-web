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
import { AlertModal } from "../../../components/AlertModal";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { TableToolbar } from "./Header";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useTableUtils } from "../../../utils/hooks/useTableUtils";
import { InactiveCompany } from "../InactiveCompaniesModal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Member } from "../../../types/member";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { InvitationModal } from "../../Invitation/InvitationModal";

interface CompanyTableProps {
  companies: Company[];
  onAddCompany: () => void;
  onOpen: (company: Company) => void;
  onEdit: (company: any) => void;
  onReactivate: (selectedIds: number[]) => Promise<void>;
  onDelete: (company: Company) => void;
  fileName?: string;
  companyType?: "Empresas" | "Filiais";
  deletedCompanies: InactiveCompany[];
  handleRowClick?: () => void;
  onUnlink: (company: any) => void;
  onRowClick: (companyId: number) => void;

  members: Member[];
  userPolicies: RoleOption[];
}

type RoleOption = {
  id: number;
  name: string;
};

export const CompanyTable = ({
  fileName,
  companies,
  onAddCompany,
  onOpen,
  onEdit,
  onDelete,
  onReactivate,
  deletedCompanies,
  companyType = "Empresas",
  onUnlink,
  onRowClick,
  userPolicies,
  members = [],
}: CompanyTableProps) => {
  const {
    page,
    rowsPerPage,
    searchTerm,
    orderBy,
    orderDirection,
    paginatedItems: paginatedCompanies,
    filteredItems: filteredCompanies,
    setPage,
    setRowsPerPage,
    setSearchTerm,
    handleSort,
  } = useTableUtils(companies, (company) => company.companyName);

  const { exportPDF, exportCSV } = useExportUtils(`${fileName}-empresas`);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUnlinkDialog, setOpenUnlinkDialog] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

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
    onRowClick(companyId);
  };

  const handleInviteModal = () => {
    setInviteOpen(true);
  };

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
      onDelete(selectedCompany);
    }
    handleMenuClose();
    setOpenDialog(false);
  };

  const handleUnlink = async () => {
    if (selectedCompany) {
      onUnlink(selectedCompany);
    }
    handleMenuClose();
    setOpenDialog(false);
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
      { label: "Empresa", accessor: (row: any) => row.companyName || row.name },
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
        deletedCompanies={deletedCompanies}
        title={companyType}
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
                onClick={() => handleRowClick(company.id || company.companyId)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  {formatCNPJ(company.businessEntity?.cnpj)}
                </TableCell>
                <TableCell>
                  {company.businessEntity.nomeFantasia ||
                    company.businessEntity.razaoSocial}
                </TableCell>
                <TableCell>{`${company.businessEntity?.municipio}, ${company.businessEntity?.uf}`}</TableCell>
                <TableCell>{company.businessEntity?.email}</TableCell>
                <TableCell>
                  {formatPhoneNumberSymbolized(
                    company.businessEntity?.telefone
                  )}
                </TableCell>
                <TableCell>
                  <MoreHorizIcon
                    onClick={(event: any) => {
                      event.stopPropagation();
                      handleMenuOpen(event, company);
                    }}
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
        <MenuItem onClick={handleEdit} sx={{ display: "flex", gap: 1 }}>
          <ModeEditOutlinedIcon sx={{ fontSize: "18px" }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => setOpenDialog(true)}
          sx={{ display: "flex", gap: 1 }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: "18px" }} />
          Inativar
        </MenuItem>
        <MenuItem onClick={handleInviteModal} sx={{ display: "flex", gap: 1 }}>
          <GroupAddOutlinedIcon sx={{ fontSize: "18px" }} />
          Convidar
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", gap: 1, color: "var(--status-error-950)" }}
          onClick={() => setOpenUnlinkDialog(true)}
        >
          <CloseRoundedIcon sx={{ fontSize: "18px" }} />
          Sair
        </MenuItem>
      </Menu>
      {/* Deletar Empresa */}
      <AlertModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          handleDelete();
          setOpenDialog(false);
        }}
        title="Deseja inativar esta empresa?"
        confirmText="Sim, inativar"
        cancelText="Não, manter empresa"
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
            <span style={{ textAlign: "center", fontWeight: "bold" }}>
              {selectedCompany?.companyName}{" "}
            </span>
            <span style={{ textAlign: "center" }}>
              Você também irá inativar todas as filiais dessa empresa.
            </span>
            <Alert color="info" severity="info">
              Você pode reverter essa ação na aba de empresas inativas.
            </Alert>
          </div>
        }
        type="warning"
      />

      {/* Sair da Empresa */}
      <AlertModal
        open={openUnlinkDialog}
        onClose={() => setOpenUnlinkDialog(false)}
        onConfirm={() => {
          handleUnlink();
          setOpenUnlinkDialog(false);
        }}
        title="Deseja sair desta empresa?"
        confirmText="Sim, sair"
        cancelText="Cancelar"
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
            <span style={{ textAlign: "center", fontWeight: "bold" }}>
              {selectedCompany?.companyName}{" "}
            </span>
            <span style={{ textAlign: "center" }}>
              Tem certeza que deseja sair dessa empresa?
            </span>
            <Alert color="warning" severity="warning">
              Saindo, você estará se desvinculando da empresa.
            </Alert>
          </div>
        }
        type="warning"
      />
      <InvitationModal
        userPolicies={userPolicies}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        members={members}
        companyId={selectedCompany?.companyId}
        subCompanyId={selectedCompany?.companyId}
      />
    </TableContainer>
  );
};
