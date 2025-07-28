import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";

export type BalanceteData = {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
  budgetedAmount: boolean;
};

interface Props {
  data: BalanceteData[];
}

const isNegative = (value: number) => value < 0;

// Agrupa por centro de custo inteiro (1, 2, 3...)
const groupByMainCostCenter = (data: BalanceteData[]) => {
  const groups: Record<string, BalanceteData[]> = {};

  data.forEach((item) => {
    const groupKey = item.costCenter.split(".")[0]; // Pega o "1" de "1.1.2"
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });

  return groups;
};

export const BalanceSheetTable = ({ data }: Props) => {
  const groupedData = groupByMainCostCenter(data);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid var(--neutral-200)" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell
              sx={{ fontWeight: "var(--fontWeightSemiBold)" }}
              align="left"
            >
              Conta
            </TableCell>
            <TableCell
              sx={{ fontWeight: "var(--fontWeightSemiBold)" }}
              align="left"
            >
              Descrição
            </TableCell>
            <TableCell
              sx={{ fontWeight: "var(--fontWeightSemiBold)" }}
              align="right"
            >
              Valor Inicial
            </TableCell>
            <TableCell
              sx={{ fontWeight: "var(--fontWeightSemiBold)" }}
              align="right"
            >
              Crédito
            </TableCell>
            <TableCell
              sx={{ fontWeight: "var(--fontWeightSemiBold)" }}
              align="right"
            >
              Débito
            </TableCell>
            <TableCell
              sx={{ fontWeight: "var(--fontWeightSemiBold)" }}
              align="right"
            >
              Valor Final
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.entries(groupedData).map(([groupKey, items]) => {
            const main = items.find((i) => i.costCenter === groupKey);
            const children = items.filter((i) => i.costCenter !== groupKey);

            return (
              <Fragment key={groupKey}>
                {main && (
                  <TableRow
                    sx={{
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleGroup(groupKey)}
                      >
                        {openGroups[groupKey] ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "var(--neutral-600)",
                      }}
                    >
                      {main.costCenter}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "var(--fontWeightSemiBold)",
                        color: "var(--neutral-600)",
                      }}
                    >
                      {main.name}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: isNegative(main.initialValue)
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {main.initialValue}
                    </TableCell>
                    <TableCell align="right">
                      {main.credit}
                    </TableCell>
                    <TableCell align="right">
                      {main.debit}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: isNegative(main.finalValue) ? "red" : "inherit",
                      }}
                    >
                      {main.finalValue}
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                  >
                    <Collapse
                      in={openGroups[groupKey]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Table size="small">
                        <TableBody>
                          {children.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell />
                              <TableCell
                                sx={{
                                  fontWeight: "var(--fontWeightSemiBold)",
                                  color: "var(--neutral-700)",
                                }}
                              >
                                {row.costCenter}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "var(--fontWeightSemiBold)",
                                  color: "var(--neutral-700)",
                                }}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color: isNegative(row.initialValue)
                                    ? "red"
                                    : "inherit",
                                }}
                              >
                                {row.initialValue}
                              </TableCell>
                              <TableCell align="right">
                                {row.credit}
                              </TableCell>
                              <TableCell align="right">
                                {row.debit}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color: isNegative(row.finalValue)
                                    ? "red"
                                    : "inherit",
                                }}
                              >
                                {row.finalValue}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import { Fragment } from "react";
