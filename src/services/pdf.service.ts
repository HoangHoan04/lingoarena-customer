import jsPDF from "jspdf";
import autoTable, { type RowInput, type Styles } from "jspdf-autotable";

export interface PdfColumn {
  field: string;
  header: string;
  width?: number;
  align?: "left" | "center" | "right";
  formatter?: (value: any) => string;
}

export interface PdfOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  orientation?: "portrait" | "landscape";
  pageSize?: "a4" | "a3" | "letter";
  fontSize?: number;
  headerColor?: [number, number, number];
  alternateRowColor?: [number, number, number];
  showPageNumber?: boolean;
  showDate?: boolean;
  footerText?: string;
  author?: string;
  margin?: number;
  summary?: PdfSummaryItem[];
  logo?: string;
}

export interface PdfSummaryItem {
  label: string;
  value: string;
}

export interface PdfExportResult {
  success: boolean;
  filename: string;
  pagesCount: number;
}

type DocBuilder = {
  doc: jsPDF;
  pageWidth: number;
  currentY: number;
  options: {
    title: string;
    subtitle: string;
    orientation: "portrait" | "landscape";
    pageSize: "a4" | "a3" | "letter";
    fontSize: number;
    headerColor: [number, number, number];
    alternateRowColor: [number, number, number];
    showPageNumber: boolean;
    showDate: boolean;
    footerText: string;
    margin: number;
  };
};

class PdfService {
  private readonly DEFAULTS = {
    fontSize: 10,
    headerColor: [31, 78, 121] as [number, number, number],
    altRowColor: [235, 243, 255] as [number, number, number],
    margin: 15,
  };

  async exportToPdf<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {},
  ): Promise<PdfExportResult> {
    const builder = this.initBuilder(options);
    this.renderHeader(builder, "Ngày xuất");
    this.renderTable(builder, data, columns);
    this.renderSummary(builder, options.summary);
    this.finalizeDoc(
      builder.doc,
      options.filename || `export_${Date.now()}.pdf`,
    );

    return this.getResult(
      builder.doc,
      options.filename || `export_${Date.now()}.pdf`,
    );
  }

  async previewPdf<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {},
  ): Promise<PdfExportResult> {
    const builder = this.initBuilder(options);
    this.renderHeader(builder, "Ngày xem");
    this.renderTable(builder, data, columns);
    this.renderSummary(builder, options.summary);
    this.openPreview(builder.doc);

    return this.getResult(
      builder.doc,
      options.filename || `preview_${Date.now()}.pdf`,
    );
  }

  async printPdf<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {},
  ): Promise<PdfExportResult> {
    const builder = this.initBuilder(options);
    this.renderHeader(builder);
    this.renderTable(builder, data, columns);
    this.renderSummary(builder, options.summary);
    this.sendToPrint(builder.doc);

    return this.getResult(
      builder.doc,
      options.filename || `print_${Date.now()}.pdf`,
    );
  }

  async getPdfBlob<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {},
  ): Promise<Blob> {
    const builder = this.initBuilder(options);
    this.renderHeader(builder);
    this.renderTable(builder, data, columns);
    return builder.doc.output("blob");
  }

  async exportHtmlToPdf(
    elementId: string,
    options: PdfOptions = {},
  ): Promise<PdfExportResult> {
    const {
      filename = `export_${Date.now()}.pdf`,
      title,
      orientation = "portrait",
      pageSize = "a4",
    } = options;

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Không tìm thấy element với id="${elementId}"`);
      }

      const doc = new jsPDF({ orientation, format: pageSize });
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = this.DEFAULTS.margin;

      if (title) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, pageWidth / 2, currentY, { align: "center" });
        currentY += 10;
      }

      const tables = element.querySelectorAll("table");
      if (tables.length > 0) {
        tables.forEach((table, index) => {
          if (index > 0) {
            doc.addPage();
            currentY = this.DEFAULTS.margin;
          }
          autoTable(doc, {
            html: table as HTMLTableElement,
            startY: currentY,
            margin: { left: this.DEFAULTS.margin, right: this.DEFAULTS.margin },
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: {
              fillColor: this.DEFAULTS.headerColor,
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: this.DEFAULTS.altRowColor,
            },
          });
        });
      } else {
        const text = element.innerText || element.textContent || "";
        const lines = doc.splitTextToSize(
          text,
          pageWidth - 2 * this.DEFAULTS.margin,
        );
        doc.setFontSize(10);
        doc.text(lines, this.DEFAULTS.margin, currentY);
      }

      doc.save(filename);
      const pagesCount = (doc as any).internal.getNumberOfPages?.() ?? 1;
      return { success: true, filename, pagesCount };
    } catch {
      throw new Error("Có lỗi xảy ra khi xuất HTML sang PDF");
    }
  }

  printHtmlElement(
    elementId: string,
    options?: { title?: string; css?: string },
  ): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const { title = "In trang", css = "" } = options || {};

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
            th { background: #1F4E79; color: white; font-weight: bold; }
            tr:nth-child(even) { background: #f0f7ff; }
            h1, h2, h3 { color: #1F4E79; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            ${css}
          </style>
        </head>
        <body>
          ${
            options?.title
              ? `<h2 style="text-align:center;margin-bottom:12px;">${options.title}</h2>`
              : ""
          }
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  registerFont(
    fontName: string,
    fontBase64: string,
    style: "normal" | "bold" | "italic" = "normal",
  ): void {
    const jsDoc = new jsPDF();
    jsDoc.addFileToVFS(`${fontName}-${style}.ttf`, fontBase64);
    jsDoc.addFont(`${fontName}-${style}.ttf`, fontName, style);
  }

  private initBuilder(options: PdfOptions): DocBuilder {
    const {
      title = "",
      subtitle = "",
      orientation = "landscape",
      pageSize = "a4",
      fontSize = this.DEFAULTS.fontSize,
      headerColor = this.DEFAULTS.headerColor,
      alternateRowColor = this.DEFAULTS.altRowColor,
      showPageNumber = true,
      showDate = true,
      footerText = "",
      author = "LingoArena",
      margin = this.DEFAULTS.margin,
    } = options;

    const doc = new jsPDF({ orientation, format: pageSize });
    doc.setProperties({
      title: title || "Document",
      author,
      creator: "LingoArena System",
      subject: subtitle || "",
    });

    return {
      doc,
      pageWidth: doc.internal.pageSize.getWidth(),
      currentY: margin,
      options: {
        title,
        subtitle,
        orientation,
        pageSize,
        fontSize,
        headerColor,
        alternateRowColor,
        showPageNumber,
        showDate,
        footerText,
        margin,
      },
    };
  }

  private renderHeader(builder: DocBuilder, dateLabel = "Ngày xuất"): void {
    const { doc, pageWidth, options } = builder;
    const { title, subtitle, showDate, headerColor, margin } = options;
    let { currentY } = builder;

    if (title) {
      doc.setFontSize(16);
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(title, pageWidth / 2, currentY, { align: "center" });
      currentY += 8;
    }

    if (subtitle) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, pageWidth / 2, currentY, { align: "center" });
      currentY += 6;
    }

    if (showDate) {
      const dateStr = `${dateLabel}: ${new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(dateStr, pageWidth - margin, currentY, { align: "right" });
      currentY += 4;
    }

    if (title || subtitle || showDate) {
      doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;
    }

    builder.currentY = currentY;
  }

  private renderTable<T>(
    builder: DocBuilder,
    data: T[],
    columns: PdfColumn[],
  ): void {
    const { doc, pageWidth, options } = builder;
    const { fontSize, headerColor, alternateRowColor, margin } = options;

    const tableHeaders = columns.map((col) => ({
      content: col.header,
      styles: {
        halign: col.align || "left",
        fontStyle: "bold",
      } as Partial<Styles>,
    }));

    const tableRows: RowInput[] = data.map((item: any) =>
      columns.map((col) => {
        const value = this.getNestedValue(item, col.field);
        const displayValue = col.formatter
          ? col.formatter(value)
          : this.formatCellValue(value);
        return {
          content: displayValue,
          styles: { halign: col.align || "left" } as Partial<Styles>,
        };
      }),
    );

    const tableWidth = pageWidth - 2 * margin;
    const totalWeight = columns.reduce((sum, col) => sum + (col.width || 1), 0);
    const columnStyles: Record<number, Partial<Styles>> = {};
    columns.forEach((col, idx) => {
      columnStyles[idx] = {
        cellWidth: ((col.width || 1) / totalWeight) * tableWidth,
      };
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: builder.currentY,
      margin: { left: margin, right: margin },
      styles: {
        fontSize,
        cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
        overflow: "linebreak",
        lineColor: [210, 210, 210],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        minCellHeight: 10,
        fontSize,
      },
      alternateRowStyles: {
        fillColor: alternateRowColor,
      },
      columnStyles,
      didDrawPage: (hookData) => {
        const pageH = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);

        if (options.footerText) {
          doc.text(options.footerText, margin, pageH - 8);
        }

        if (options.showPageNumber) {
          const pageInfo = `Trang ${hookData.pageNumber}`;
          doc.text(pageInfo, pageWidth - margin, pageH - 8, {
            align: "right",
          });
        }
      },
    });

    const lastAutoTable = (doc as any).lastAutoTable;
    builder.currentY = lastAutoTable
      ? lastAutoTable.finalY + 10
      : builder.currentY + 10;
  }

  private renderSummary(builder: DocBuilder, summary?: PdfSummaryItem[]): void {
    if (!summary || summary.length === 0) return;

    const { doc, pageWidth, options } = builder;
    const { margin } = options;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, builder.currentY, pageWidth - margin, builder.currentY);
    builder.currentY += 4;

    doc.setFontSize(9);
    summary.forEach((item) => {
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.text(`${item.label}:`, margin + 5, builder.currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(item.value, margin + 5 + 60, builder.currentY);
      builder.currentY += 5;
    });
  }

  private finalizeDoc(doc: jsPDF, filename: string): void {
    doc.save(filename);
  }

  private openPreview(doc: jsPDF): void {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  private sendToPrint(doc: jsPDF): void {
    doc.autoPrint();
    const blobUrl = doc.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl as unknown as string;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 5000);
    };
  }

  private getResult(doc: jsPDF, filename: string): PdfExportResult {
    const pagesCount = (doc as any).internal.getNumberOfPages?.() ?? 1;
    return { success: true, filename, pagesCount };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private formatCellValue(value: any): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Có" : "Không";
    if (value instanceof Date) {
      return value.toLocaleDateString("vi-VN");
    }
    return String(value);
  }
}

export const pdfService = new PdfService();
