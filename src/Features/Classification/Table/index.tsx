import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import RemoveDoneOutlinedIcon from "@mui/icons-material/RemoveDoneOutlined";
import { toast } from "sonner";
import { ExportButton } from "../../../components/Button/ExportButton";
import { SearchInput } from "../../../components/Inputs/SearchInput";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";

export interface AccountPlanRow {
  id: number;
  costCenter: string;
  name: string;
  budgetedAmount: boolean;
}

interface BondListItem {
  accountPlanClassificationId: number;
  costCenters: { costCenter: string }[];
  classificationName: string;
}

interface AccountPlanTableProps {
  data: AccountPlanRow[];
  selectedKeys: string[];
  onSelect: (selected: string[]) => void;
  onSort: (field: keyof AccountPlanRow) => void;
  accountType: number;
  onAccountTypeChange: (type: number) => void;
  classificationBonds: { bondList: BondListItem[] };
  onRemoveClassified: (costCentersToRemove: string[]) => void;
}

export const AccountPlanTable = ({
  data,
  selectedKeys,
  onSelect,
  onSort,
  accountType,
  onAccountTypeChange,
  classificationBonds,
  onRemoveClassified,
}: AccountPlanTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const { exportExcel } = useExportUtils();
  const isExportMenuOpen = Boolean(exportAnchorEl);

  const handleCheckboxToggle = (id: string) => {
    onSelect(
      selectedKeys.includes(id)
        ? selectedKeys.filter((k) => k !== id)
        : [...selectedKeys, id]
    );
  };

  const getClassification = (costCenter: string) => {
    for (const group of classificationBonds.bondList) {
      if (
        Array.isArray(group.costCenters) &&
        group.costCenters.some((cc) => cc.costCenter === costCenter)
      ) {
        return {
          id: group.accountPlanClassificationId,
          name: group.classificationName,
        };
      }
    }

    return null;
  };

  const filteredData =
    data?.filter((row) => {
      const query = search.toLowerCase();
      return (
        row.name.toLowerCase().includes(query) ||
        row.costCenter.toLowerCase().includes(query)
      );
    }) || [];

  const closeExportMenu = () => {
    setExportAnchorEl(null);
  };

  const handleExportAccountPlan = () => {
    if (filteredData.length === 0) {
      toast.warning("Nenhum dado para exportar.");
      closeExportMenu();
      return;
    }

    exportExcel(
      filteredData,
      [
        { label: "Conta", accessor: (row) => row.costCenter },
        { label: "Descrição", accessor: (row) => row.name },
        {
          label: "Classificação",
          accessor: (row) => getClassification(row.costCenter)?.name || "",
        },
      ],
      "plano-de-contas"
    );

    closeExportMenu();
  };

  const handleExportClassification = () => {
    const rows = filteredData
      .map((row) => ({
        ...row,
        classificationName: getClassification(row.costCenter)?.name || "",
      }))
      .filter((row) => row.classificationName);

    if (rows.length === 0) {
      toast.warning("Nenhuma classificação para exportar.");
      closeExportMenu();
      return;
    }

    exportExcel(
      rows,
      [
        { label: "Conta", accessor: (row) => row.costCenter },
        { label: "Descrição", accessor: (row) => row.name },
        {
          label: "Classificação",
          accessor: (row) => row.classificationName,
        },
      ],
      "classificacao-atual"
    );

    closeExportMenu();
  };

  return (
    <Paper elevation={0} sx={{ border: "1px solid #ddd" }}>
      <Box p={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl
          size="small"
          sx={{
            width: 200,
            "& .MuiOutlinedInput-root.Mui-focused": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <InputLabel>Tipo de Conta</InputLabel>
          <Select
            value={accountType}
            onChange={(e) => onAccountTypeChange(Number(e.target.value))}
            label="Tipo de Conta"
          >
            <MenuItem value={0}>Todos</MenuItem>
            <MenuItem value={1}>Ativo</MenuItem>
            <MenuItem value={2}>Passivo</MenuItem>
            <MenuItem value={3}>DRE</MenuItem>
          </Select>
        </FormControl>
        <SearchInput
          size="small"
          value={search}
          placeholder="Pesquisar"
          onChange={setSearch}
        />
        <Box sx={{ ml: "auto" }}>
          <ExportButton
            onClick={(event) => setExportAnchorEl(event.currentTarget)}
          />
          <Menu
            anchorEl={exportAnchorEl}
            open={isExportMenuOpen}
            onClose={closeExportMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleExportAccountPlan}>
              <ListItemIcon>
                <DescriptionOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Plano de Contas"
                secondary="Conta, descrição e classificação"
              />
            </MenuItem>
            <MenuItem onClick={handleExportClassification}>
              <ListItemIcon>
                <FactCheckOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Classificação atual"
                secondary="Somente itens classificados"
              />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {selectedKeys.length > 0 && (
                  <Tooltip title="Limpar seleção">
                    <IconButton aria-label="delete" size="small" sx={{ p: 0 }}>
                      <RemoveDoneOutlinedIcon
                        fontSize="inherit"
                        onClick={() => {
                          onRemoveClassified(selectedKeys);
                          onSelect([]);
                        }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell onClick={() => onSort("costCenter")} align="center">
                Conta
              </TableCell>
              <TableCell onClick={() => onSort("name")} align="center">
                Descrição
              </TableCell>
              <TableCell align="center">Classificação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhum balancete encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isSelected = selectedKeys.includes(row.costCenter);
                  const classification = getClassification(row.costCenter);

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => handleCheckboxToggle(row.costCenter)}
                      sx={{
                        backgroundColor: isSelected ? "#f3f3f3" : "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {classification !== null ? (
                          <Tooltip
                            title={`Classificado como ${classification.name}`}
                          >
                            <CheckIcon color="success" />
                          </Tooltip>
                        ) : (
                          <Checkbox
                            sx={{ padding: "6px 16px" }}
                            checked={isSelected}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxToggle(row.costCenter);
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell>{row.costCenter}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 240,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip title={row.name}>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              maxWidth: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              verticalAlign: "middle",
                            }}
                          >
                            {row.name}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 220,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {classification ? (
                          <Tooltip title={classification.name}>
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                maxWidth: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                verticalAlign: "middle",
                              }}
                            >
                              {classification.name}
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
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
        count={filteredData.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Paper>
  );
};
