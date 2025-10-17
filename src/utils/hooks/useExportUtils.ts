import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";
import * as XLSX from "xlsx";
import PptxGenJS from "pptxgenjs";

type Column<DataType> = {
  label: string;
  accessor: (item: DataType) => any;
};

type Orientation = "portrait" | "landscape";

export const useExportUtils = () => {
  const exportPDF = <T>(
    data: T[],
    columns: Column<T>[],
    fileName: string,
    orientation: Orientation = "portrait"
  ) => {
    const doc = new jsPDF({
      orientation,
      unit: "pt",
      format: "a4",
    });

    const head = [columns.map((col) => col.label)];
    const body = data.map((item) => columns.map((col) => col.accessor(item)));

    autoTable(doc, {
      head,
      body,
      styles: { fontSize: 8 },
    });

    doc.save(`${fileName}.pdf`);
  };

  const exportCSV = <T>(data: T[], columns: Column<T>[], fileName: string) => {
    const csvData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        row[col.label] = col.accessor(item);
      });
      return row;
    });

    const csv = unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = <T>(
    data: T[],
    columns: Column<T>[],
    fileName: string
  ) => {
    const worksheetData = [
      columns.map((col) => col.label),
      ...data.map((item) => columns.map((col) => col.accessor(item))),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportPPTX = <T>(data: T[], columns: Column<T>[], fileName: string) => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    slide.addText(fileName, { x: 1, y: 0.5, fontSize: 18, bold: true });

    const tableData = [
      columns.map((col) => col.label),
      ...data.map((item) => columns.map((col) => col.accessor(item))),
    ];

    slide.addTable(tableData, { x: 0.5, y: 1, w: 9 });

    pptx.writeFile({ fileName: `${fileName}.pptx` });
  };

  return { exportPDF, exportCSV, exportExcel, exportPPTX };
};
