import assert from "node:assert/strict";
import test from "node:test";
import { buildReclassifiedDetailRows } from "./reclassifiedDetailsAdapter.ts";

test("monta totalizador, classifications e datas nos níveis corretos", () => {
  const rows = buildReclassifiedDetailRows({
    realizado: {
      "2026-01": [
        {
          id: 1,
          typeOrder: 1,
          name: "Disponibilidades",
          totalValue: 125,
          expandable: true,
          classifications: [
            {
              id: 10,
              typeOrder: 1,
              name: "Caixa",
              value: 125,
              datas: [
                {
                  id: 20,
                  name: "Conta corrente",
                  value: 125,
                },
              ],
            },
          ],
        },
      ],
    },
    orcado: {
      "2026-01": [
        {
          id: 1,
          typeOrder: 1,
          name: "Disponibilidades",
          totalValue: 100,
          expandable: true,
          classifications: [
            {
              id: 10,
              typeOrder: 1,
              name: "Caixa",
              value: 100,
              datas: [
                {
                  id: 20,
                  name: "Conta corrente",
                  value: 100,
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const totalizer = rows[0];
  const classification = totalizer?.children[0];
  const data = classification?.children[0];

  assert.equal(totalizer?.kind, "totalizer");
  assert.equal(totalizer?.name, "Disponibilidades");
  assert.equal(totalizer?.values.realizado?.["2026-01"], 125);
  assert.equal(totalizer?.values.orcado?.["2026-01"], 100);
  assert.equal(classification?.kind, "classification");
  assert.equal(classification?.name, "Caixa");
  assert.equal(classification?.values.realizado?.["2026-01"], 125);
  assert.equal(data?.kind, "data");
  assert.equal(data?.name, "Conta corrente");
  assert.equal(data?.values.realizado?.["2026-01"], 125);
});

test("consolida meses na mesma linha mesmo quando os IDs mensais mudam", () => {
  const rows = buildReclassifiedDetailRows({
    realizado: {
      "2026-01": [
        {
          id: 101,
          typeOrder: 1,
          name: "Disponibilidades",
          totalValue: 10,
          expandable: true,
          classifications: [
            {
              id: 201,
              typeOrder: 1,
              name: "Caixa",
              value: 10,
              datas: [{ id: 301, name: "Conta A", value: 10 }],
            },
          ],
        },
      ],
      "2026-02": [
        {
          id: 102,
          typeOrder: 1,
          name: "Disponibilidades",
          totalValue: 20,
          expandable: true,
          classifications: [
            {
              id: 202,
              typeOrder: 1,
              name: "Caixa",
              value: 20,
              datas: [{ id: 302, name: "Conta A", value: 20 }],
            },
          ],
        },
      ],
    },
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.children.length, 1);
  assert.equal(rows[0]?.children[0]?.children.length, 1);
  assert.equal(rows[0]?.values.realizado?.["2026-01"], 10);
  assert.equal(rows[0]?.values.realizado?.["2026-02"], 20);
  assert.equal(rows[0]?.children[0]?.values.realizado?.["2026-02"], 20);
  assert.equal(
    rows[0]?.children[0]?.children[0]?.values.realizado?.["2026-02"],
    20,
  );
});
