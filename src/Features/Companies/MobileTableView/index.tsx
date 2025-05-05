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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Company } from "../../../types/company";
import {
  formatCNPJ,
  formatPhoneNumberSymbolized,
} from "../../../utils/formatters";
import { TableToolbar } from "../CompanyTable/Header";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

interface MobileTableViewProps {
  companies: Company[];
  onAddClick: () => void;
  onAddCompany: () => void;
  onOpen: (company: Company) => void;
  onEdit: (company: Company) => void;
  onReactivate: (selectedIds: number[]) => Promise<void>;
  onDelete: (company: Company) => void;
  onMoreClick: (event: React.MouseEvent<HTMLElement>) => void;
  fileName?: string;
}

export const MobileTableView: React.FC<MobileTableViewProps> = ({
  companies,
  onAddClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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

  return (
    <Box sx={{ gridArea: "content" }}>
      <TableToolbar
        title="Empresas"
        onAddClick={onAddClick}
        onExport={() => {}}
        searchValue=""
        onSearchChange={() => {}}
        onReactivate={async () => {}}
      />
      {companies.map((company) => (
        <Accordion key={company.companyId} sx={{ p: "1em", m: 0 }} elevation={0} disableGutters>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ flex: 1, p: 0}}
            >
              <Stack>
                <Typography fontWeight={600}>{company.companyName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCNPJ(company.businessEntity.cnpj)}
                </Typography>
              </Stack>
            </AccordionSummary>

            <IconButton
              onClick={(event: any) => handleMenuOpen(event, company)}
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
              <MenuItem sx={{ display: "flex", gap: 1 }}>
                <OpenInNewRoundedIcon
                  color="action"
                  sx={{ fontSize: "18px" }}
                />
                Abrir
              </MenuItem>
              <MenuItem sx={{ display: "flex", gap: 1 }}>
                <EditRoundedIcon
                  sx={{
                    fontSize: "18px",
                    color: "var(--branding-default-blue)",
                  }}
                />
                Editar
              </MenuItem>
              <MenuItem sx={{ display: "flex", gap: 1 }}>
                <DeleteRoundedIcon
                  sx={{ fontSize: "18px", color: "var(--status-error-950)" }}
                />
                Excluir
              </MenuItem>
            </Menu>
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
