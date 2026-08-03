import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import type {
  ReclassifiedBalanceSheetRow,
  ReclassifiedPeriod,
  ReclassifiedScenario,
} from "../../../types/reclassifiedBalanceSheetV2";
import {
  formatBalanceDifference,
  getBalanceCheckStatus,
  getScenarioColumns,
  sortByDisplayOrder,
} from "./reclassifiedBalanceSheet.utils";
import { StickyCell, StickyHead, StickyHeadFirstCell } from "./styles";

interface BalanceCheckSectionProps {
  row?: ReclassifiedBalanceSheetRow;
  periods: ReclassifiedPeriod[];
  scenarios: ReclassifiedScenario[];
  showBudgetColumns?: boolean;
  hiddenPeriodKeys: string[];
}

export const BalanceCheckSection = ({
  row,
  periods,
  scenarios,
  showBudgetColumns = false,
  hiddenPeriodKeys,
}: BalanceCheckSectionProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();
  const [isBalanceCheckVisible, setIsBalanceCheckVisible] = useState(false);
  const sortedPeriods = useMemo(
    () => sortByDisplayOrder(periods),
    [periods],
  );
  const scenarioColumns = useMemo(
    () => getScenarioColumns(scenarios, showBudgetColumns),
    [scenarios, showBudgetColumns],
  );
  const visiblePeriods = useMemo(() => {
    const hidden = new Set(hiddenPeriodKeys);
    return sortedPeriods.filter((period) => !hidden.has(period.key));
  }, [hiddenPeriodKeys, sortedPeriods]);

  const statusText = (value: number | null | undefined) => {
    const status = getBalanceCheckStatus(value);
    if (status === "success") return "Balanço fechado";
    if (status === "error") return "Balanço não fecha";
    return "Sem dados para conferência";
  };

  return (
    <Box component="section" width="100%">
      <Button
        variant="outlined"
        onClick={() => setIsBalanceCheckVisible((current) => !current)}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: isBalanceCheckVisible
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: theme.transitions.create("transform"),
            }}
          />
        }
        aria-expanded={isBalanceCheckVisible}
        aria-controls="balance-check-content"
        sx={{ textTransform: "none", fontWeight: 700 }}
      >
        Conferência do Balanço
      </Button>

      <Collapse in={isBalanceCheckVisible} unmountOnExit>
        <TableContainer
          id="balance-check-content"
          component={Paper}
          elevation={0}
          sx={{ mt: 1.5, borderRadius: 3, overflow: "auto" }}
        >
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    ...StickyHeadFirstCell,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  Descrição
                </TableCell>
                {visiblePeriods.map((period) => (
                  <TableCell
                    key={period.key}
                    align="center"
                    colSpan={scenarioColumns.length}
                    sx={{
                      ...StickyHead,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Tooltip
                      title={period.type === "accumulated" ? "Year to Date" : ""}
                    >
                      <b>{period.label}</b>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
              {showBudgetColumns && (
                <TableRow>
                  <TableCell
                    sx={{
                      ...StickyHeadFirstCell,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  {visiblePeriods.flatMap((period) =>
                    scenarioColumns.map((scenario) => (
                      <TableCell
                        key={`${period.key}-${scenario.key}`}
                        align="right"
                        sx={{
                          ...StickyHead,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {scenario.label}
                      </TableCell>
                    )),
                  )}
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    ...StickyCell,
                    border: `1px solid ${theme.palette.divider}`,
                    fontWeight: 700,
                  }}
                >
                  {row?.name ?? "Diferença do Balanço"}
                </TableCell>
                {visiblePeriods.flatMap((period) =>
                  scenarioColumns.map((scenario) => {
                    const value =
                      row?.values?.[scenario.key]?.[period.key] ?? null;
                    const status = getBalanceCheckStatus(value);
                    const color =
                      status === "success"
                        ? theme.palette.success.main
                        : status === "error"
                          ? theme.palette.error.main
                          : theme.palette.text.secondary;
                    return (
                      <TableCell
                        key={`${period.key}-${scenario.key}`}
                        align="right"
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                      >
                        <Tooltip title={statusText(value)}>
                          <Typography
                            component="span"
                            variant="body2"
                            fontWeight={700}
                            sx={{ color }}
                          >
                            {formatBalanceDifference(value, valueMode)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    );
                  }),
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};
