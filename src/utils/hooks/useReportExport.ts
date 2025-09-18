// utils/useReportExport.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "../../assets/images/logo-consultar-horizontal.png";

type Orientation = "p" | "l"; // p = portrait, l = landscape

export const useReportExport = (
  fileName: string,
  fileTitle?: string,
  orientation: Orientation = "p"
) => {
  const exportDashboardPDF = async (elementId: string) => {
    const input = document.getElementById(elementId);
    if (!input) return;

    const pdf = new jsPDF(orientation, "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // === Função para renderizar header ===
    const renderHeader = () => {
      pdf.addImage(companyLogo, "PNG", 10, 8, 40, 12); // logo
      pdf.setFontSize(14);
      pdf.text(`MRP Consultar - ${fileTitle ?? "Relatório"}`, 60, 15);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(10, 22, pageWidth - 10, 22);
    };

    // === Função para renderizar footer ===
    const renderFooter = (pageNumber: number, totalPages: number) => {
      pdf.setFontSize(10);
      pdf.text("www.consultarmrp.com.br", 14, pageHeight - 10);
      pdf.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - 40,
        pageHeight - 10
      );
    };

    // Renderiza header inicial
    renderHeader();

    // === Captura dashboard ===
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 28;

    // === Se for multipágina ===
    if (pdfHeight > pageHeight - 40) {
      let remainingHeight = pdfHeight;
      while (remainingHeight > 0) {
        pdf.addImage(
          imgData,
          "PNG",
          10,
          position,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST"
        );

        remainingHeight -= pageHeight - 40;

        if (remainingHeight > 0) {
          pdf.addPage();
          renderHeader();
        }
      }
    } else {
      pdf.addImage(imgData, "PNG", 10, position, pdfWidth, pdfHeight);
    }

    // === Adiciona footer em TODAS as páginas ===
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      renderFooter(i, totalPages);
    }

    // === Salva PDF ===
    pdf.save(`${fileName}.pdf`);
  };

  return { exportDashboardPDF };
};
