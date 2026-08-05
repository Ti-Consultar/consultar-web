# Design Pattern das Tabelas Financeiras

> Fonte de referência para qualquer criação ou alteração visual nas tabelas financeiras do MRP.
>
> Última atualização: 05/08/2026.

## Objetivo

Padronizar a leitura horizontal das tabelas financeiras, tornando claros os blocos de cada mês e a diferença entre **Orçado**, **Realizado** e **Variação**, sem modificar regras de negócio ou comportamentos existentes.

Antes de alterar uma tabela financeira, este documento deve ser revisado e usado como checklist.

## Fonte de verdade no código

Os tokens e utilitários compartilhados estão em:

`src/Features/BalanceSheet/financialTableStyles.ts`

Devem ser reutilizados sempre que possível. Não duplicar cores, estilos sticky, regras de borda ou lógica de hover dentro de uma tabela específica.

Principais recursos compartilhados:

- `FINANCIAL_TABLE_COLORS`
- `FINANCIAL_STICKY_HEAD_FIRST_CELL_SX`
- `FINANCIAL_STICKY_FIRST_CELL_SX`
- `FINANCIAL_TABLE_HOVER_SX`
- `getFinancialMetricHeaderSx`
- `getFinancialMonthHeaderSx`
- `getFinancialValueCellSx`
- `getFinancialColumnHoverSx`
- `useFinancialTableHover`

## Tokens visuais

| Elemento | Cor |
| --- | --- |
| Célula Orçado | `#F8FAFD` |
| Célula Realizado | `#FFFFFF` |
| Célula Variação | `#F4F6F8` |
| Cabeçalho do mês | `#EEF3FA` |
| Cabeçalhos Orçado, Realizado e Variação | `#F7F9FC` |
| Subtotal | `#F7F9FB` |
| Total | `#EEF3F8` |
| Borda de separação forte | `#AEB8C5` |
| Hover cruzado | `#f0eff7` |

As bordas comuns seguem o divisor padrão de `1px` da tabela.

## Cabeçalhos

### Cabeçalho do mês

- Fundo `#EEF3FA`.
- Texto centralizado.
- Peso `700`.
- Deve abranger as métricas visíveis do mês por meio de `colSpan`.
- Deve permanecer fixo durante o scroll vertical.

### Cabeçalhos das métricas

- Orçado, Realizado e Variação usam o mesmo fundo `#F7F9FC`.
- Peso `600`.
- Texto alinhado à direita.
- Devem permanecer fixos abaixo do cabeçalho do mês durante o scroll vertical.

### Cabeçalho da descrição

- Deve permanecer fixo no topo e à esquerda.
- Usa o mesmo fundo do cabeçalho do mês.
- Não deve existir borda grossa entre Descrição e a primeira métrica.
- Caso a tabela já permita redimensionar a coluna, esse comportamento deve ser preservado.

## Blocos mensais e bordas

- Quando **Mostrar Orçamento estiver ativado**, cada mês é formado por Orçado, Realizado e Variação.
- Nesse estado, deve existir uma borda vertical de `2px solid #AEB8C5` após Variação.
- A mesma separação forte deve aparecer no limite direito do cabeçalho do mês.
- Quando **Mostrar Orçamento estiver desativado**, somente Realizado é exibido e todas as bordas permanecem no padrão comum de `1px`.
- A borda forte nunca deve aparecer antes de Orçado ou entre Descrição e a primeira métrica.

## Valores numéricos

- Alinhamento à direita.
- Usar `font-variant-numeric: tabular-nums`.
- Valores negativos continuam sendo exibidos entre parênteses.
- Valores ausentes e zeros devem preservar a regra de exibição original de cada tabela.
- Não alterar arredondamentos, escalas, percentuais ou regras de formatação existentes.

## Hierarquia das linhas

| Tipo | Peso | Fundo | Regra adicional |
| --- | ---: | --- | --- |
| Linha comum/detalhe | `400` | Fundo da métrica | — |
| Grupo | `600` | Conforme a estrutura da tabela | — |
| Subtotal/totalizador | `600` | `#F7F9FB` | Não participa do hover |
| Total | `700` | `#EEF3F8` | Borda superior `2px solid #AEB8C5`; não participa do hover |

Usar os metadados semânticos já existentes na tabela, como `rowType`, `kind`, `highlightedMetrics` ou equivalentes. Não inferir uma nova classificação financeira pelo nome da linha quando a API não fornece essa informação.

## Hover cruzado

O hover deve facilitar o cruzamento visual da célula numérica atual:

- Destaca simultaneamente a linha horizontal e a coluna vertical.
- Cor `#f0eff7`.
- Aplica-se somente às células numéricas comuns da área de dados.
- Não pode alterar cabeçalhos.
- Não pode alterar a coluna de descrição.
- Não pode alterar totais, subtotais, totalizadores ou linhas de validação/conferência.
- Passar o mouse sobre um elemento excluído não deve ativar o cruzamento.

Para manter esse comportamento, somente células elegíveis devem receber `data-financial-hover-cell="true"` e sua chave em `data-financial-column`.

## Scroll e posicionamento fixo

- A coluna de descrição permanece fixa durante o scroll horizontal.
- Os cabeçalhos permanecem fixos durante o scroll vertical.
- As camadas devem respeitar a ordem: cabeçalho de descrição, demais cabeçalhos e descrição do corpo.
- No Balanço Reclassificado, Ativo e Passivo devem permanecer sincronizados horizontalmente.
- Em tabelas que possuam uma única grade, não criar sincronização desnecessária.

## Regras funcionais obrigatórias

Alterações deste padrão são exclusivamente visuais. Não modificar:

- Cálculos ou fórmulas.
- Dados retornados ou adaptadores.
- Contratos, parâmetros ou endpoints da API.
- Estrutura hierárquica.
- Regras de expansão e recolhimento.
- Filtros ou seleção de meses.
- Exportações.
- Alternância de Mostrar Orçamento.
- Formatação funcional de valores.

### Balanço Patrimonial/Reclassificado

- A Variação permanece sem setas.
- A Variação permanece sem cores de positivo ou negativo.
- Ativo e Passivo mantêm o scroll horizontal sincronizado.

### Balanço Contábil

- A tela usa o contrato hierárquico de `GET /v2/painel` como fonte de verdade.
- Ativo e Passivo são exibidos simultaneamente, sem abas, e mantêm o scroll horizontal sincronizado.
- A hierarquia e a expansão seguem `parentCode`, `level`, `expandable` e `details` retornados pela API.
- A Conferência do Balanço usa diretamente a linha `BALANCE_DIFFERENCE` retornada pela API; não recalcular a diferença no front-end.
- A tabela exibe somente o cenário Realizado e, portanto, usa apenas bordas comuns de `1px`.

### DRE

- Preservar exatamente a regra atual de setas e cores de Variação definida pelo Product Owner.
- Não reinterpretar receitas, despesas ou sinal favorável/desfavorável.

### Demais tabelas

- Preservar a regra de Variação que já existir.
- Não adicionar setas ou cores quando a tabela não as possuir.

## Tabelas que já usam o padrão

- Balanço Reclassificado — Ativo e Passivo.
- Balanço Contábil — Ativo e Passivo.
- DRE.
- Fluxo de Caixa.
- Resultados — Gestão de Liquidez.
- Resultados — Índices Econômicos.
- Resultados — CIL/EC.
- Resultados — Eficiência Operacional.
- Conferência do Balanço usa os estilos estruturais, mas não participa do hover cruzado.

## Checklist para novas tabelas

Antes de considerar a alteração concluída, verificar:

- [ ] Os helpers compartilhados foram reutilizados.
- [ ] O mês está visualmente agrupado.
- [ ] Os três cabeçalhos de métricas usam `#F7F9FC`.
- [ ] As células de Orçado, Realizado e Variação usam seus fundos específicos.
- [ ] A borda de `2px` aparece somente após Variação e somente com Mostrar Orçamento ativo.
- [ ] Não existe borda grossa entre Descrição e a primeira métrica.
- [ ] Cabeçalhos e descrição estão fixos.
- [ ] Números estão alinhados à direita e usam algarismos tabulares.
- [ ] Pesos de linha seguem a hierarquia definida.
- [ ] Subtotais e totais usam os fundos corretos.
- [ ] O hover cruzado não invade cabeçalhos, descrições ou totalizações.
- [ ] Negativos e valores ausentes mantêm a formatação original.
- [ ] Setas e cores de Variação mantêm a regra original da tabela.
- [ ] Expansão, filtros, exportação, API e cálculos não foram alterados.
- [ ] Scroll sincronizado foi preservado onde já é necessário.
