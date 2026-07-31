import { Totalizer } from "../../../types/balanco";

export type DreRowRole =
  | "TOTALIZER"
  | "GROUP_SUM"
  | "INDICATOR"
  | "CLASSIFIABLE";

export interface DreRowPresentation {
  role: DreRowRole;
  order: number;
  backgroundColor: "#FAFCFE" | "#E8F1FF";
  fontWeight: 400 | 700;
  fontStyle: "normal" | "italic";
  expandable: boolean;
  marginLeft: number;
  displayName?: string;
}

interface DreRowDefinition {
  names: string[];
  role: DreRowRole;
  order: number;
  displayName?: string;
}

const normalizeDreRowName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");

const DRE_ROW_DEFINITIONS: DreRowDefinition[] = [
  {
    names: ["Receita Bruta", "Receita Operacional Bruta"],
    role: "TOTALIZER",
    order: 10,
  },
  {
    names: ["(-) Deduções da Receita Bruta"],
    role: "TOTALIZER",
    order: 20,
  },
  {
    names: ["(=) Receita Líquida de Vendas"],
    role: "GROUP_SUM",
    order: 30,
  },
  // Mantido por consistência contábil: Receita Líquida menos CPV/CMV/CSP.
  {
    names: ["Lucro Bruto"],
    role: "GROUP_SUM",
    order: 35,
  },
  {
    names: ["Margem Bruta %"],
    role: "INDICATOR",
    order: 40,
  },
  {
    names: ["Custos Variáveis"],
    role: "TOTALIZER",
    order: 50,
  },
  {
    names: [
      "Margem Contribuição",
      "Margem de Contribuição",
      "(=) Margem de Contribuição",
    ],
    role: "GROUP_SUM",
    order: 60,
    displayName: "Margem de Contribuição",
  },
  {
    names: ["Margem Contribuição %", "Margem de Contribuição %"],
    role: "INDICATOR",
    order: 70,
  },
  {
    names: ["(-) Despesas Operacionais"],
    role: "TOTALIZER",
    order: 80,
  },
  {
    names: ["Lucro Operacional"],
    role: "GROUP_SUM",
    order: 90,
  },
  {
    names: ["Margem Operacional %"],
    role: "INDICATOR",
    order: 100,
  },
  {
    names: ["Lucro Antes do Resultado Financeiro"],
    role: "GROUP_SUM",
    order: 110,
  },
  {
    names: ["Margem LAJIR %"],
    role: "INDICATOR",
    order: 120,
  },
  {
    names: ["Resultado do Exercício Antes do Imposto"],
    role: "GROUP_SUM",
    order: 130,
  },
  {
    names: ["Margem LAIR %"],
    role: "INDICATOR",
    order: 140,
  },
  {
    names: ["Lucro Líquido do Periodo", "Lucro Líquido do Período"],
    role: "GROUP_SUM",
    order: 150,
  },
  {
    names: ["Margem Líquida %"],
    role: "INDICATOR",
    order: 160,
  },
  {
    names: ["EBITDA"],
    role: "GROUP_SUM",
    order: 170,
  },
  {
    names: ["Margem EBITDA %"],
    role: "INDICATOR",
    order: 180,
  },
  {
    names: ["NOPAT"],
    role: "GROUP_SUM",
    order: 190,
  },
  {
    names: ["Margem NOPAT %"],
    role: "INDICATOR",
    order: 200,
  },
];

const presentationByName = new Map<string, DreRowPresentation>();

export const DEFAULT_DRE_TOTALIZER_PRESENTATION: DreRowPresentation = {
  role: "TOTALIZER",
  order: Number.POSITIVE_INFINITY,
  backgroundColor: "#FAFCFE",
  fontWeight: 700,
  fontStyle: "normal",
  expandable: true,
  marginLeft: 0,
};

export const DRE_CLASSIFIABLE_PRESENTATION: DreRowPresentation = {
  role: "CLASSIFIABLE",
  order: Number.POSITIVE_INFINITY,
  backgroundColor: "#FAFCFE",
  fontWeight: 400,
  fontStyle: "normal",
  expandable: true,
  marginLeft: 1.5,
};

DRE_ROW_DEFINITIONS.forEach(({ names, role, order, displayName }) => {
  const presentation: DreRowPresentation = {
    role,
    order,
    backgroundColor: role === "GROUP_SUM" ? "#E8F1FF" : "#FAFCFE",
    fontWeight: role === "INDICATOR" ? 400 : 700,
    fontStyle: role === "INDICATOR" ? "italic" : "normal",
    expandable: role === "TOTALIZER",
    marginLeft: role === "INDICATOR" ? 3 : 0,
    displayName,
  };

  names.forEach((name) => {
    presentationByName.set(normalizeDreRowName(name), presentation);
  });
});

export const getDreRowPresentation = (
  name: string,
): DreRowPresentation | undefined =>
  presentationByName.get(normalizeDreRowName(name));

export const sortDreTotalizers = (rows: Totalizer[]): Totalizer[] =>
  [...rows].sort((a, b) => {
    const aOrder = getDreRowPresentation(a.name)?.order;
    const bOrder = getDreRowPresentation(b.name)?.order;

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;

    // Itens adicionais da API continuam visíveis e preservam a ordem original.
    return a.typeOrder - b.typeOrder;
  });
