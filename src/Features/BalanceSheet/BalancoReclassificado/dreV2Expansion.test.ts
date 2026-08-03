import assert from "node:assert/strict";
import test from "node:test";
import type { DreV2Row } from "../../../types/dreV2";
import { getDreClassificationExpansionCodes } from "../DreV2/expansion.ts";

const row = (
  code: string,
  rowType: DreV2Row["rowType"],
  parentCode: string | null,
  expandable: boolean,
): DreV2Row => ({
  code,
  name: code,
  rowType,
  valueType: "currency",
  displayOrder: 1,
  level: parentCode ? 1 : 0,
  parentCode,
  expandable,
  source: {
    sourceType: "structural",
    totalizerId: null,
    classificationId: null,
    sourceParentTotalizerId: null,
  },
  details: { available: false, counts: {} },
  values: {},
});

test("expansão global da DRE revela classifications sem abrir datas", () => {
  const rows = [
    row("SECTION", "section", null, true),
    row("CLASSIFICATION", "classification", "SECTION", true),
    row("DATA", "adjustment", "CLASSIFICATION", false),
  ];

  assert.deepEqual(getDreClassificationExpansionCodes(rows), ["SECTION"]);
});

