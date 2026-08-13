import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { BreakEvenSimulationSignRule } from "../../types/breakEven";
import {
  applySimulationSignRule,
  formatHumanPercentage,
  parseHumanPercentage,
} from "./breakEven.utils";
import { EditableCellInput, EditableCellShell } from "./styles";

interface SimulationCellProps {
  ariaLabel: string;
  value: number;
  disabled?: boolean;
  compact?: boolean;
  highlighted?: boolean;
  signRule?: BreakEvenSimulationSignRule;
  onValueChange: (value: number) => void;
  onValidityChange: (valid: boolean) => void;
}

export const SimulationCell = ({
  ariaLabel,
  value,
  disabled = false,
  compact = false,
  highlighted = false,
  signRule = null,
  onValueChange,
  onValidityChange,
}: SimulationCellProps) => {
  const [text, setText] = useState(() => formatHumanPercentage(value));
  const [invalid, setInvalid] = useState(false);
  const isEditing = useRef(false);
  const valueAtFocus = useRef(value);
  const lastAppliedValue = useRef(value);

  useEffect(() => {
    if (!isEditing.current) setText(formatHumanPercentage(value));
  }, [value]);

  const validateAndApply = (nextText: string) => {
    const parsed = parseHumanPercentage(nextText);
    const normalized =
      parsed === null ? null : applySimulationSignRule(parsed, signRule);
    const isValid = normalized !== null && normalized >= -1;
    setInvalid(!isValid);
    onValidityChange(isValid);
    if (isValid && normalized !== null) {
      lastAppliedValue.current = normalized;
      onValueChange(normalized);
    }
    return isValid;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setText(formatHumanPercentage(valueAtFocus.current));
      setInvalid(false);
      onValidityChange(true);
      if (lastAppliedValue.current !== valueAtFocus.current) {
        onValueChange(valueAtFocus.current);
      }
      event.currentTarget.blur();
    }
  };

  return (
    <EditableCellShell $compact={compact} $highlighted={highlighted}>
      <EditableCellInput
        aria-label={ariaLabel}
        aria-invalid={invalid}
        disabled={disabled}
        inputMode="decimal"
        $invalid={invalid}
        $highlighted={highlighted}
        value={text}
        title={invalid ? "Informe um percentual igual ou superior a -100%." : undefined}
        onChange={(event) => {
          const nextText = event.target.value;
          const parsed = parseHumanPercentage(nextText);
          const shouldPrefixNegative =
            signRule === "negative" &&
            parsed !== null &&
            parsed > 0 &&
            !nextText.trimStart().startsWith("-");
          setText(shouldPrefixNegative ? `-${nextText.replace(/^\s*\+/, "")}` : nextText);
          validateAndApply(nextText);
        }}
        onFocus={(event) => {
          isEditing.current = true;
          valueAtFocus.current = value;
          lastAppliedValue.current = value;
          requestAnimationFrame(() => event.currentTarget.select());
        }}
        onBlur={() => {
          isEditing.current = false;
          const parsed = parseHumanPercentage(text);
          if (parsed !== null) {
            setText(formatHumanPercentage(applySimulationSignRule(parsed, signRule)));
          }
        }}
        onKeyDown={handleKeyDown}
      />
    </EditableCellShell>
  );
};
