import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  cellStyle,
  CornerHeaderStyle,
  headerStyle,
  rowHeaderStyle,
} from "./styles";

export type SpreadsheetCell = {
  value: string | number | null;
  rowSpan?: number;
  colSpan?: number;
};

export type SpreadsheetRow = SpreadsheetCell[];

export type SpreadsheetData = {
  columns: string[];
  rows: SpreadsheetRow[];
};

type SpreadsheetTableProps = {
  data: SpreadsheetData;
};

export const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({ data }) => {
  const columnVisibility: VisibilityState = {};

  const columns = React.useMemo<ColumnDef<SpreadsheetRow>[]>(
    () =>
      data.columns.map((col, colIndex) => ({
        id: col,
        header: col,
        accessorFn: (row) => row[colIndex],
        cell: (info) => info.getValue(),
      })),
    [data.columns]
  );

  const table = useReactTable({
    data: data.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility },
  });

  return (
    <div style={{ overflow: "auto", border: "1px solid #ddd" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={CornerHeaderStyle}></th>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    ...headerStyle,
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 1,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td
                style={{
                  ...rowHeaderStyle,
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  backgroundColor: "#fff",
                }}
              >
                {rowIndex + 1}
              </td>
              {row.getVisibleCells().map((cell) => {
                const cellData = cell.getValue<SpreadsheetCell>();

                if (!cellData) return null;
                if (cellData.value === null) return null;

                return (
                  <td
                    key={cell.id}
                    rowSpan={cellData.rowSpan ?? 1}
                    colSpan={cellData.colSpan ?? 1}
                    style={cellStyle}
                  >
                    {cellData.value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
