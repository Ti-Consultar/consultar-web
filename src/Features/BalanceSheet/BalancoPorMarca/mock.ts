// ==========================
// TIPOS BASE
// ==========================

export interface DreApiEntity {
  nivel: "Grupo" | "Empresa";
  accountPlanId: number;
  groupId: number;
  companyId: number | null;
  nome: string;
  painel: {
    months: DreMonth[];
  };
}

interface DreMonth {
  id: number;
  name: string;
  dateMonth: number;
  monthPainelContabilTotalizer: null;
  totalizer: DreTotalizer[];
}

interface DreTotalizer {
  id: number;
  typeOrder: number;
  name: string;
  totalValue: number | null;
  classifications?: DreClassification[];
}

interface DreClassification {
  id: number;
  typeOrder: number;
  name: string;
  value: number | null;
  datas?: unknown[];
}

// ==========================
// MOCK
// ==========================

export const dreMockData: DreApiEntity[] = [
  {
    nivel: "Grupo",
    accountPlanId: 11014,
    groupId: 9007,
    companyId: null,
    nome: "Consolidado do Grupo",
    painel: {
      months: [
        {
          id: 12143,
          name: "January",
          dateMonth: 1,
          monthPainelContabilTotalizer: null,
          totalizer: [
            {
              id: 8371,
              typeOrder: 11,
              name: "Receita Operacional Bruta",
              totalValue: 5870345.65,
              classifications: [
                {
                  id: 8785,
                  typeOrder: 45,
                  name: "Vendas de Produtos",
                  value: 5392434.2,
                  datas: [],
                },
                {
                  id: 8787,
                  typeOrder: 47,
                  name: "Prestação de Serviço",
                  value: 477911.45,
                  datas: [],
                },
              ],
            },
            {
              id: 8372,
              typeOrder: 12,
              name: "(-) Deduções da Receita Bruta",
              totalValue: -95751.05,
              classifications: [
                {
                  id: 8791,
                  typeOrder: 51,
                  name: "(-) Impostos e Contribuições",
                  value: -95751.05,
                  datas: [],
                },
              ],
            },
            {
              id: 8373,
              typeOrder: 13,
              name: "(=) Receita Líquida de Vendas",
              totalValue: 5774594.6,
              classifications: [],
            },
            {
              id: 8374,
              typeOrder: 14,
              name: "Lucro Bruto",
              totalValue: 5774594.6,
              classifications: [],
            },
            {
              id: 8375,
              typeOrder: 15,
              name: "Margem Bruta %",
              totalValue: 100,
              classifications: [],
            },
            {
              id: 8379,
              typeOrder: 19,
              name: "Lucro Operacional",
              totalValue: 5739178.86,
              classifications: [],
            },
            {
              id: 8385,
              typeOrder: 25,
              name: "Lucro Líquido do Período",
              totalValue: 5739178.86,
              classifications: [],
            },
          ],
        },
      ],
    },
  },

  {
    nivel: "Empresa",
    accountPlanId: 11016,
    groupId: 9007,
    companyId: 5007,
    nome: "Loja 02",
    painel: {
      months: [
        {
          id: 12159,
          name: "January",
          dateMonth: 1,
          monthPainelContabilTotalizer: null,
          totalizer: [
            {
              id: 8491,
              typeOrder: 11,
              name: "Receita Operacional Bruta",
              totalValue: 236363.74,
              classifications: [
                {
                  id: 9046,
                  typeOrder: 46,
                  name: "Vendas de Mercadorias",
                  value: 227748.09,
                  datas: [],
                },
                {
                  id: 9048,
                  typeOrder: 48,
                  name: "Receita com Locação",
                  value: 8615.65,
                  datas: [],
                },
              ],
            },
            {
              id: 8492,
              typeOrder: 12,
              name: "(-) Deduções da Receita Bruta",
              totalValue: -121330.21,
              classifications: [
                {
                  id: 9049,
                  typeOrder: 49,
                  name: "(-) Devoluções de Vendas",
                  value: -87756.32,
                  datas: [],
                },
                {
                  id: 9051,
                  typeOrder: 51,
                  name: "(-) Impostos e Contribuições",
                  value: -33573.89,
                  datas: [],
                },
              ],
            },
            {
              id: 8493,
              typeOrder: 13,
              name: "(=) Receita Líquida de Vendas",
              totalValue: 115033.53,
              classifications: [],
            },
            {
              id: 8494,
              typeOrder: 14,
              name: "Lucro Bruto",
              totalValue: 87385.98,
              classifications: [],
            },
            {
              id: 8505,
              typeOrder: 25,
              name: "Lucro Líquido do Período",
              totalValue: 53412.24,
              classifications: [],
            },
          ],
        },
      ],
    },
  },
];
