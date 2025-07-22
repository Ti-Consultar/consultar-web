import {
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  TextField,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RemoveDoneOutlinedIcon from "@mui/icons-material/RemoveDoneOutlined";
import { SearchInput } from "../../../components/Inputs/SearchInput";

export interface AccountPlanRow {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
}

export type ValueDisplayMode = "TOTAL" | "K" | "C";
const STORAGE_KEY = "accountPlanTable:valueMode";

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
}

export const AccountPlanTable = ({
  data,
  selectedKeys,
  onSelect,
  onSort,
  accountType,
  onAccountTypeChange,
  classificationBonds,
}: AccountPlanTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [valueMode, setValueMode] = useState<ValueDisplayMode>("TOTAL");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "K" || stored === "C" || stored === "TOTAL") {
      setValueMode(stored);
    }
  }, []);

  const handleValueModeChange = (mode: ValueDisplayMode) => {
    setValueMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    handleFilterClose();
  };

  const handleCheckboxToggle = (id: string) => {
    onSelect(
      selectedKeys.includes(id)
        ? selectedKeys.filter((k) => k !== id)
        : [...selectedKeys, id]
    );
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const formatValue = (value: number) => {
    switch (valueMode) {
      case "K":
        return `${(value / 1000000).toFixed(1)}`;
      case "C":
        return Math.round(value / 1000).toLocaleString("pt-BR");
      default:
        return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    }
  };

  const filteredData =
    data?.filter((row) =>
      row.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <Paper elevation={0} sx={{ border: "1px solid #ddd" }}>
      <Box p={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <Tooltip title="Visualização dos valores">
          <IconButton onClick={handleFilterClick}>
            <TuneRoundedIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={() => handleValueModeChange("TOTAL")}>
            <ListItemIcon>
              {valueMode === "TOTAL" && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>Padrão (Total)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleValueModeChange("C")}>
            <ListItemIcon>
              {valueMode === "C" && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>Milhar</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleValueModeChange("K")}>
            <ListItemIcon>
              {valueMode === "K" && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>Milhões</ListItemText>
          </MenuItem>
        </Menu>

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
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {selectedKeys.length > 0 && (
                  <Tooltip title="Limpar seleção">
                    <IconButton aria-label="delete" size="small">
                      <RemoveDoneOutlinedIcon
                        fontSize="inherit"
                        onClick={() => onSelect([])}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell onClick={() => onSort("costCenter")}>Conta</TableCell>
              <TableCell onClick={() => onSort("name")}>Descrição</TableCell>
              <TableCell onClick={() => onSort("initialValue")}>
                V. Inicial
              </TableCell>
              <TableCell onClick={() => onSort("credit")}>Crédito</TableCell>
              <TableCell onClick={() => onSort("debit")}>Débito</TableCell>
              <TableCell onClick={() => onSort("finalValue")}>
                V. Final
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Escolha uma data acima para trazer o balancete.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isSelected = selectedKeys.includes(row.costCenter);

                  // Procura se o costCenter está classificado em algum grupo
                  const classificationId = (() => {
                    for (const group of classificationBonds.bondList) {
                      if (
                        group.costCenters.some(
                          (cc) => cc.costCenter === row.costCenter
                        )
                      ) {
                        return group.accountPlanClassificationId;
                      }
                    }
                    return null;
                  })();

                  const classificationName = (() => {
                    for (const group of classificationBonds.bondList) {
                      if (
                        group.costCenters.some(
                          (cc) => cc.costCenter === row.costCenter
                        )
                      ) {
                        return group.classificationName;
                      }
                    }
                    return null;
                  })();

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
                      <TableCell padding="checkbox">
                        {classificationId !== null ? (
                          <Tooltip
                            title={`Classificado como ${classificationName}`}
                          >
                            <CheckIcon color="success" />
                          </Tooltip>
                        ) : (
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              handleCheckboxToggle(row.costCenter)
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>{row.costCenter}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{formatValue(row.initialValue)}</TableCell>
                      <TableCell>{formatValue(row.credit)}</TableCell>
                      <TableCell>{formatValue(row.debit)}</TableCell>
                      <TableCell>{formatValue(row.finalValue)}</TableCell>
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
