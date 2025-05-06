import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";

type Column<DataType> = {
  label: string;
  accessor: (item: DataType) => any;
};

export const useExportUtils = (fileName: string) => {
  const exportPDF = <T>(data: T[], columns: Column<T>[]) => {
    const doc = new jsPDF();
    const head = [columns.map((col) => col.label)];
    const body = data.map((item) => columns.map((col) => col.accessor(item)));

    autoTable(doc, {
      head,
      body,
    });

    doc.save(`${fileName}.pdf`);
  };

  const exportCSV = <T>(data: T[], columns: Column<T>[]) => {
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

  return { exportPDF, exportCSV };
};
