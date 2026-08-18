import { memo } from "react";
import { useValueDisplay } from "../../contexts/ValueDisplayContext";
import type { BreakEvenRow } from "../../types/breakEven";
import { formatBreakEvenValue, sortBreakEvenRows } from "./breakEven.utils";
import { SimulationCell } from "./SimulationCell";
import {
  DreCell,
  FinancialTable,
  NumericCell,
  TableFrame,
  TableRow,
} from "./styles";

interface BreakEvenTableProps {
  rows: BreakEvenRow[];
  simulations: Record<string, number>;
  dimmed: boolean;
  disabled: boolean;
  onSimulationChange: (rowCode: string, value: number) => void;
  onValidityChange: (rowCode: string, valid: boolean) => void;
}

const BreakEvenTableComponent = ({
  rows,
  simulations,
  dimmed,
  disabled,
  onSimulationChange,
  onValidityChange,
}: BreakEvenTableProps) => {
  const { valueMode } = useValueDisplay();

  return (
    <TableFrame>
    <FinancialTable aria-label="DRE do ponto de equilíbrio">
      <thead>
        <tr>
          <th scope="col">DRE</th>
          <th scope="col">Simulação</th>
          <th scope="col">Projetado</th>
          <th scope="col">PE</th>
        </tr>
      </thead>
      <tbody>
        {sortBreakEvenRows(rows).map((row) => {
          const emphasized = row.rowType === "section" || row.rowType === "subtotal";
          const officialSimulation = row.simulationPercentage ?? 0;
          const draftSimulation = simulations[row.code] ?? officialSimulation;
          const highlighted = Math.abs(draftSimulation) > Number.EPSILON;
          return (
            <TableRow key={row.code} $rowType={row.rowType}>
              <DreCell $level={row.level} $emphasized={emphasized}>
                {row.name}
              </DreCell>
              <NumericCell>
                {row.canSimulate ? (
                  <SimulationCell
                    ariaLabel={`Simulação de ${row.name}`}
                    disabled={disabled}
                    highlighted={highlighted}
                    signRule={row.simulationSignRule}
                    value={draftSimulation}
                    onValueChange={(value) => onSimulationChange(row.code, value)}
                    onValidityChange={(valid) => onValidityChange(row.code, valid)}
                  />
                ) : null}
              </NumericCell>
              <NumericCell $dimmed={dimmed}>
                {formatBreakEvenValue(
                  row.projectedValue,
                  row.valueType,
                  valueMode,
                )}
              </NumericCell>
              <NumericCell $dimmed={dimmed}>
                {formatBreakEvenValue(
                  row.breakEvenValue,
                  row.valueType,
                  valueMode,
                )}
              </NumericCell>
            </TableRow>
          );
        })}
      </tbody>
    </FinancialTable>
    </TableFrame>
  );
};

export const BreakEvenTable = memo(BreakEvenTableComponent);
