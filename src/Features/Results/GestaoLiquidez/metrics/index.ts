export const metricLabels: Record<string, string> = {
  // Variaveis da Liquidez
  saldoTesouraria: "Saldo Tesouraria",
  ncg: "Necessidade de Capital de Giro (NCG)",
  cdg: "Capital de Giro (CDG)",
  indiceDeLiquidez: "Índice de Liquidez (%)",
  // Dinamica do Capital de Giro
  pme: "(PME) Prazo Médio Estocagem",
  pmr: "(PMR) Prazo Médio Clientes",
  pmp: "(PMP) Prazo Médio Fornecedores",
  cicloFinanceiroDasOperacoesPrincipais: "Ciclo Financeiro Operacional",
  cicloFinanceiroNCG: "Ciclo Financeiro da NCG",

  // Geração de Fluxo de Caixa Bruto
  ebitida: "EBITDA",
  margemEBITIDA: "Margem EBITDA",
  variacaoNCG: "Variação da NCG",
  fluxoCaixaOperacional: "Fluxo de Caixa Operacional",
  geracaoCaixa: "Geração de Caixa",
  aumentoReducaoFluxoCaixa: "Aumento/Redução do Fluxo de Caixa",

  // Rotatividade
  giroPME: "Giro (PME)",
  giroPMR: "Giro (PMR)",
  giroPMP: "Giro (PMP)",
  giroCaixa: "Giro Caixa",

  // Liquidez
  liquidezCorrente: "(LC) Liquidez Corrente",
  liquidezSeca: "(LS) Liquidez Seca",
  liquidezImediata: "(LI) Liquidez Imediata",

  // Estrutura de Capital
  terceirosCurtoPrazo: "Endividamento de Terceiros de Curto Prazo",
  terceirosLongoPrazo: "Endividamento de Terceiros de Longo Prazo",
  participacaoCapitalTerceiros: "Participação de Capital de Terceiros",
  participacaoCapitalProprio: "Participação de Capital Próprio",
};

export const metricKeys: string[] = [
  "saldoTesouraria",
  "ncg",
  "cdg",
  "indiceDeLiquidez",
  "pme",
  "pmr",
  "pmp",
  "cicloFinanceiroDasOperacoesPrincipais",
  "cicloFinanceiroNCG",
  "ebitida",
  "margemEBITIDA",
  "variacaoNCG",
  "fluxoCaixaOperacional",
  "geracaoCaixa",
  "aumentoReducaoFluxoCaixa",
  "giroPME",
  "giroPMR",
  "giroPMP",
  "giroCaixa",
  "liquidezCorrente",
  "liquidezSeca",
  "liquidezImediata",
  "terceirosCurtoPrazo",
  "terceirosLongoPrazo",
  "participacaoCapitalTerceiros",
  "participacaoCapitalProprio",
];
