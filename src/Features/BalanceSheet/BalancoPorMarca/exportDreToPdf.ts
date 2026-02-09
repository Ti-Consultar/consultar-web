import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DreColumn, DreRow } from "../../../types/balancoPorMarca";

interface ExportDreToPdfParams {
  title: string;
  year: number;
  month: string;
  columns: DreColumn[];
  rows: DreRow[];
}

export function exportDreToPdf({
  title,
  year,
  month,
  columns,
  rows,
}: ExportDreToPdfParams) {
  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const doc = new jsPDF("l", "pt", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();

  /* ================= HEADER VISUAL ================= */

  // Faixa azul superior
  doc.setFillColor(42, 69, 122); // #2A457A
  doc.rect(0, 0, pageWidth, 30, "F");

  // Linha vermelha inferior
  doc.setFillColor(148, 25, 29); // #94191D
  doc.rect(0, 30, pageWidth, 3, "F");

  /* ================= CONTEÚDO HEADER ================= */

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(42, 69, 122);
  doc.text(title, 40, 55);

  // Mês / Ano
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`${capitalizeFirstLetter(month)} / ${year}`, 40, 72);

  // Texto lado direito
  doc.setFontSize(9);
  doc.setTextColor(42, 69, 122);
  doc.text("Valores em milhar", pageWidth - 40, 55, {
    align: "right",
  });

  /* ================= TABELA ================= */

  const head = [["Descrição", ...columns.map((c) => c.label)]];

  const body = rows.map((row) => [
    row.name,
    ...columns.map((c) => {
      const value = row.values[c.key];

      if (value === null || value === undefined) return "-";

      const isNegative = value < 0;
      const absValue = Math.abs(value);

      if (row.isPercentage) {
        const formatted = absValue.toLocaleString("pt-BR", {
          maximumFractionDigits: 2,
        });

        return isNegative ? `(${formatted}%)` : `${formatted}%`;
      }

      // valores em milhar
      const divided = absValue / 1000;

      const formatted = divided.toLocaleString("pt-BR", {
        maximumFractionDigits: 0,
      });

      return isNegative ? `(${formatted})` : formatted;
    }),
  ]);

  autoTable(doc, {
    startY: 90,
    head,
    body,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      valign: "middle",
      textColor: [60, 60, 60],
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [30, 30, 30],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { cellWidth: 220 },
    },
    didParseCell: (hook) => {
      if (hook.section !== "body") return;

      const rowIndex = hook.row.index;
      if (rowIndex == null) return;

      const dreRow = rows[rowIndex];
      if (!dreRow) return;

      if (dreRow.rowType === "TOTALIZER") {
        hook.cell.styles.fontStyle = "bold";
      }

      const colIndex = hook.column.index;
      if (colIndex > 0 && columns[colIndex - 1]?.isGroup) {
        hook.cell.styles.fillColor = [235, 235, 235];
        hook.cell.styles.fontStyle = "bold";
      }
    },
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR"); // formato DD/MM/AAAA

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `Exportado via www.consultarmrp.com.br em ${formattedDate}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" },
  );

  doc.save(`${title.replace(/\s+/g, "_")}_${month}_${year}.pdf`);
}
