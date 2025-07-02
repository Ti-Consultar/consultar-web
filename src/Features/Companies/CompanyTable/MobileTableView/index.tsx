import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Divider,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Company } from "../../../../types/company";
import {
  formatCNPJ,
  formatPhoneNumberSymbolized,
} from "../../../../utils/formatters";
import { TableToolbar } from "../Header";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { AlertModal } from "../../../../components/AlertModal";
import { useTableUtils } from "../../../../utils/hooks/useTableUtils";
import { useExportUtils } from "../../../../utils/hooks/useExportUtils";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Protected } from "../../../../components/Protection";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Member } from "../../../../types/member";

type RoleOption = {
  id: number;
  name: string;
};

interface MobileTableViewProps {
  companies: Company[];
  onAddClick: () => void;
  onAddCompany: () => void;
  onEdit: (company: any) => void;
  onReactivate: (selectedIds: number[]) => Promise<void>;
  onDelete: (company: Company) => void;
  onRowClick: (companyId: number) => void;
  onUnlink: (company: any) => void;
  fileName?: string;

  getUserPolicies?: () => Promise<RoleOption[]>;
  members: Member[];
  userPolicies: RoleOption[];
}

export const MobileTableView: React.FC<MobileTableViewProps> = ({
  companies,
  onAddClick,
  onEdit,
  onDelete,
  onReactivate,
  onRowClick,
  fileName,
  onUnlink,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { exportPDF, exportCSV } = useExportUtils(`${fileName}-empresas`);
  const [openUnlinkDialog, setOpenUnlinkDialog] = useState(false);
  const { searchTerm, setSearchTerm, setPage, filteredItems } = useTableUtils(
    companies,
    (company) => company.companyName
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

  const handleClickEdit = (company: Company) => {
    onEdit(company);
  };

  const handleClickDelete = () => {
    if (selectedCompany) {
      onDelete(selectedCompany);
      setOpenDialog(false);
    }
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
        exportCSV(filteredItems, columns);
        break;
      case "PDF":
        exportPDF(filteredItems, columns);
        break;
      default:
        break;
    }
  };

  const handleRowClick = (companyId: number) => {
    onRowClick(companyId);
  };

  {
    /* Sair da Empresa */
  }
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
  />;

  return (
    <Box sx={{ gridArea: "content" }}>
      <TableToolbar
        title="Empresas"
        onAddClick={onAddClick}
        onExport={handleExport}
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setPage(0);
        }}
        onReactivate={onReactivate}
      />
      {filteredItems.map((company) => (
        <Accordion
          key={company.companyId}
          sx={{ p: "1em", m: 0 }}
          elevation={0}
          disableGutters
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ flex: 1, p: 0 }}
            >
              <Stack>
                <Typography fontWeight={600}>
                  {company.businessEntity.nomeFantasia ||
                    company.businessEntity.razaoSocial}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCNPJ(company.businessEntity.cnpj)}
                </Typography>
              </Stack>
            </AccordionSummary>

            <IconButton
              onClick={(event: any) => {
                handleMenuOpen(event, company);
              }}
              sx={{ alignSelf: "center" }}
            >
              <MoreVertIcon />
            </IconButton>
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
              <MenuItem
                sx={{ display: "flex", gap: 1 }}
                onClick={() => {
                  if (selectedCompany) {
                    handleRowClick(selectedCompany.id);
                  }
                }}
              >
                <OpenInNewRoundedIcon sx={{ fontSize: "18px" }} />
                Abrir
              </MenuItem>
              <Protected
                allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
              >
                <MenuItem
                  sx={{ display: "flex", gap: 1 }}
                  onClick={() => handleClickEdit(company)}
                >
                  <EditRoundedIcon
                    sx={{
                      fontSize: "18px",
                    }}
                  />
                  Editar
                </MenuItem>
                <MenuItem
                  onClick={() => setOpenDialog(true)}
                  sx={{ display: "flex", gap: 1 }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: "18px" }} />
                  Inativar
                </MenuItem>
                <MenuItem onClick={() => {}} sx={{ display: "flex", gap: 1 }}>
                  <GroupAddOutlinedIcon sx={{ fontSize: "18px" }} />
                  Convidar
                </MenuItem>
              </Protected>
              <MenuItem
                sx={{
                  display: "flex",
                  gap: 1,
                  color: "var(--status-error-950)",
                }}
                onClick={() => {
                  handleUnlink();
                  setOpenUnlinkDialog(false);
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: "18px" }} />
                Sair da empresa
              </MenuItem>
            </Menu>
            <AlertModal
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              onConfirm={() => {
                handleClickDelete();
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
          </Stack>

          <AccordionDetails sx={{ m: 0 }}>
            <Divider sx={{ mb: 1 }} />
            <Stack>
              <Typography variant="body2" color="text.secondary">
                <strong>Localidade:</strong>{" "}
                {`${company.businessEntity.municipio} - ${company.businessEntity.uf}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {company.businessEntity.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Telefone:</strong>{" "}
                {formatPhoneNumberSymbolized(company.businessEntity.telefone)}
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
