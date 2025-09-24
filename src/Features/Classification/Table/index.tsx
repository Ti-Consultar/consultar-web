import {
  Box,
  IconButton,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import RemoveDoneOutlinedIcon from "@mui/icons-material/RemoveDoneOutlined";
import { SearchInput } from "../../../components/Inputs/SearchInput";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";

export interface AccountPlanRow {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
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

  const { valueMode } = useValueDisplay();

  const formatValue = (value: number) => {
    if (valueMode === "MILHAR") return (value / 1000).toFixed(2);
    if (valueMode === "MILHARES") return (value / 1000000).toFixed(2);
    return value.toString();
  };

  const handleCheckboxToggle = (id: string) => {
    onSelect(
      selectedKeys.includes(id)
        ? selectedKeys.filter((k) => k !== id)
        : [...selectedKeys, id]
    );
  };

  const filteredData =
    data?.filter((row) =>
      row.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <Paper elevation={0} sx={{ border: "1px solid #ddd" }}>
      <Box p={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <TableValueVisualization />

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
              <TableCell onClick={() => onSort("initialValue")} align="center">
                Inicial
              </TableCell>
              <TableCell onClick={() => onSort("credit")} align="center">
                Crédito
              </TableCell>
              <TableCell onClick={() => onSort("debit")} align="center">
                Débito
              </TableCell>
              <TableCell onClick={() => onSort("finalValue")} align="center">
                Final
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
                        Array.isArray(group.costCenters) &&
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
                        Array.isArray(group.costCenters) &&
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
                      <TableCell
                        padding="checkbox"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {classificationId !== null ? (
                          <>
                            <Tooltip
                              title={`Classificado como ${classificationName}`}
                            >
                              <CheckIcon color="success" />
                            </Tooltip>
                          </>
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
                          maxWidth: 200,
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
                      <TableCell align="right">
                        {formatValue(row.initialValue)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(row.credit)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(row.debit)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(row.finalValue)}
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
