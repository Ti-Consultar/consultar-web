import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import {
  HoverableTableRow,
  StickyHeaderCell,
  StickyTableCell,
  StyledTableCell,
} from "./styles";

type SectionKey = string;

type Classification = {
  id: number;
  name: string;
  value: number;
  valueFormatted: string;
};

type MonthData = {
  month: string | any;
  [key: SectionKey]:
    | {
        value: number;
        classifications: Classification[];
      }
    | { value: number } // Para totalGeral
    | undefined;
};

type SectionConfig = {
  key: SectionKey;
  label: string;
};

type BalancoTableProps = {
  data: MonthData[];
  sections?: SectionConfig[];
  fixedColumnTitle?: string;
  format?: (value: string) => void;
};

const SECTIONS_ATIVO: SectionConfig[] = [
  { key: "totalAtivoCirculante", label: "Total Ativo Circulante" },
  { key: "totalLongoPrazo", label: "Total Longo Prazo" },
  { key: "totalPermanente", label: "Total Permanente" },
  { key: "totalAtivoNaoCirculante", label: "Total Ativo Não Circulante" },
  { key: "totalGeralDoAtivo", label: "Total Geral do Ativo" },
];

const SECTIONS_PASSIVO: SectionConfig[] = [
  { key: "totalPassivoCirculante", label: "Total Passivo Circulante" },
  { key: "totalPassivoNaoCirculante", label: "Total Passivo Não Circulante" },
  { key: "patrimonioLiquido", label: "Patrimônio Líquido" },
  { key: "totalGeralDoPassivo", label: "Total Geral do Passivo" },
];

const traduzirMes = (englishMonth: string): string => {
  const date = new Date(`${englishMonth} 1, 2025`);
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(date);
  return mes.charAt(0).toUpperCase() + mes.slice(1);
};

export function BalancoContabilTable({
  data,
  sections: sectionsProp,
  fixedColumnTitle: fixedColumnTitleProp,
  format
}: BalancoTableProps) {
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  // Detecta sections e título caso não passe via props
  const { sections, fixedColumnTitle } = useMemo(() => {
    if (sectionsProp && fixedColumnTitleProp) {
      return { sections: sectionsProp, fixedColumnTitle: fixedColumnTitleProp };
    }
    if (data.length === 0) {
      return { sections: [], fixedColumnTitle: "Selecione uma data" };
    }
    if ("totalAtivoCirculante" in data[0]) {
      return { sections: SECTIONS_ATIVO, fixedColumnTitle: "ATIVO" };
    }
    if ("totalPassivoCirculante" in data[0]) {
      return { sections: SECTIONS_PASSIVO, fixedColumnTitle: "PASSIVO" };
    }
    return { sections: [], fixedColumnTitle: "Selecione uma data" };
  }, [data, sectionsProp, fixedColumnTitleProp]);

  let rowCount = 0;

  const renderRow = (
    label: string,
    rowDataByMonth: { [month: string]: string },
    isSection: boolean
  ) => {
    const rowIndex = rowCount++;
    return (
      <HoverableTableRow
        key={label}
        onMouseEnter={() => setHoverRow(rowIndex)}
        onMouseLeave={() => setHoverRow(null)}
        isSection={isSection}
      >
        <StickyTableCell
          isHovered={hoverRow === rowIndex || hoverCol === 0}
          isFocusedCell={hoverRow === rowIndex && hoverCol === 0}
          isSection={isSection}
          onMouseEnter={() => setHoverCol(0)}
          onMouseLeave={() => setHoverCol(null)}
        >
          {label}
        </StickyTableCell>
        {data.map((month, colIndex) => {
          const adjustedCol = colIndex + 1;
          return (
            <StyledTableCell
              key={month.month}
              align="right"
              isHovered={hoverRow === rowIndex || hoverCol === adjustedCol}
              isFocusedCell={hoverRow === rowIndex && hoverCol === adjustedCol}
              isSection={isSection}
              onMouseEnter={() => setHoverCol(adjustedCol)}
              onMouseLeave={() => setHoverCol(null)}
            >
              {rowDataByMonth[month.month] || "-"}
            </StyledTableCell>
          );
        })}
      </HoverableTableRow>
    );
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{minWidth: '90%'}}>
        <TableHead sx={{ backgroundColor: "#d7d9eeff" }}>
          <TableRow>
            <StickyHeaderCell sx={{ backgroundColor: "#d7d9eeff" }}>
              {fixedColumnTitle}
            </StickyHeaderCell>
            {data.map((month) => (
              <StyledTableCell key={month.month} align="right">
                {traduzirMes(month.month)}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((section) => {
            const key = section.key;

            const totalRowData = Object.fromEntries(
              data.map((month) => [
                month.month,
                month[key]?.value?.toLocaleString("pt-BR", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }) ?? "-",
              ])
            );

            const innerRowsMap: {
              [classificationName: string]: { [month: string]: string };
            } = {};

            data.forEach((month) => {
              const sectionData = month[key] as any;
              if (sectionData?.classifications) {
                sectionData.classifications.forEach((cls: Classification) => {
                  if (!innerRowsMap[cls.name]) {
                    innerRowsMap[cls.name] = {};
                  }
                  innerRowsMap[cls.name][month.month] = cls.valueFormatted;
                });
              }
            });

            return (
              <React.Fragment key={section.key}>
                {renderRow(section.label, totalRowData, true)}
                {Object.entries(innerRowsMap).map(([name, rowByMonth]) =>
                  renderRow(name, rowByMonth, false)
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
