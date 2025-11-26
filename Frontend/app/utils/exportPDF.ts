import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFData {
  priceTrends: Record<string, any>[];
  marketStats: Record<string, any>[];
  productStats: Record<string, any>[];
  categoryStats: Record<string, any>[];
}

interface SectionConfig {
  title: string;
  key: keyof PDFData;
}

export function exportPDF(data: PDFData, fileName: string): void {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    console.log(data);

    // Constants for consistent styling
    const STYLES = {
      title: {
        fontSize: 16,
        color: [34, 197, 94],
        margin: 15,
      },
      section: {
        fontSize: 12,
        color: [51, 51, 51],
        margin: 5,
      },
      table: {
        fontSize: 9,
        headerColor: [34, 197, 94],
        alternateRowColor: [245, 245, 245],
        margin: 10,
      },
    };

    const PAGE_MARGIN = 14;
    let currentY = PAGE_MARGIN;

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(STYLES.title.fontSize);
    doc.setTextColor(...STYLES.title.color);
    doc.text("Agriculture Report", PAGE_MARGIN, currentY);
    currentY += STYLES.title.margin;

    // Define sections
    const sections: SectionConfig[] = [
      { title: "Price Trends", key: "priceTrends" },
      { title: "Market Statistics", key: "marketStats" },
      { title: "Product Statistics", key: "productStats" },
      { title: "Category Statistics", key: "categoryStats" },
    ];

    // Process each section
    sections.forEach((section, index) => {
      const sectionData = data[section.key];

      if (!sectionData || sectionData.length === 0) {
        console.warn(`No data available for section: ${section.title}`);
        return;
      }

      // Add section title
      if (index > 0) {
        currentY += STYLES.section.margin;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(STYLES.section.fontSize);
      doc.setTextColor(...STYLES.section.color);
      doc.text(section.title, PAGE_MARGIN, currentY);
      currentY += STYLES.section.margin;

      // Prepare table data with better column names and value formatting
      const columns = Object.keys(sectionData[0]);
      const formattedColumns = columns.map((col) => formatColumnName(col));

      const rows = sectionData.map((entry) =>
        columns.map((col) => formatCellValue(entry[col], col))
      );

      // Add table
      autoTable(doc, {
        startY: currentY,
        head: [formattedColumns],
        body: rows,
        styles: {
          fontSize: STYLES.table.fontSize,
          font: "helvetica",
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          valign: "middle",
        },
        headStyles: {
          fillColor: STYLES.table.headerColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        alternateRowStyles: {
          fillColor: STYLES.table.alternateRowColor,
        },
        margin: { top: STYLES.table.margin },
        theme: "grid",
        didDrawPage: (data) => {
          if (data.cursor && data.cursor.y) {
            currentY = data.cursor.y;
          }
        },
      });

      // Update current Y position after table
      if (doc.lastAutoTable) {
        currentY = doc.lastAutoTable.finalY + STYLES.table.margin;
      }

      // Add page break if needed
      if (currentY > doc.internal.pageSize.height - 50) {
        doc.addPage();
        currentY = PAGE_MARGIN;
      }
    });

    // Add footer with page numbers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    const sanitizedFileName = sanitizeFileName(fileName);
    doc.save(`${sanitizedFileName}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF export");
  }
}

// Improved column name formatting
function formatColumnName(column: string): string {
  if (!column) return "Field";

  // Common column name mappings
  const commonNames: Record<string, string> = {
    // Price Trends
    productName: "Product Name",
    product: "Product",
    currentPrice: "Current Price",
    price: "Price",
    changePercent: "Change %",
    percentageChange: "Change %",
    previousPrice: "Previous Price",
    priceDifference: "Price Difference",

    // Market Stats
    market: "Market",
    region: "Region",
    volume: "Volume",
    totalVolume: "Total Volume",
    averagePrice: "Average Price",
    avgPrice: "Average Price",
    totalValue: "Total Value",
    transactions: "Transactions",

    // Product Stats
    productId: "Product ID",
    category: "Category",
    unitsSold: "Units Sold",
    revenue: "Revenue",
    profit: "Profit",
    margin: "Margin",

    // Category Stats
    categoryName: "Category Name",
    totalProducts: "Total Products",
    totalSales: "Total Sales",

    // Common fields
    id: "ID",
    name: "Name",
    date: "Date",
    time: "Time",
    createdAt: "Created At",
    updatedAt: "Updated At",
    status: "Status",
    type: "Type",
  };

  // Check if we have a common mapping
  const lowerColumn = column.toLowerCase();
  for (const [key, value] of Object.entries(commonNames)) {
    if (lowerColumn === key.toLowerCase()) {
      return value;
    }
  }

  // Fallback: Convert camelCase, snake_case, kebab-case to readable format
  return column
    .replace(/([A-Z])/g, " ៛1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

// Improved cell value formatting
function formatCellValue(value: any, columnName: string): string {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  // Handle special characters and encoding issues
  if (typeof value === "string") {
    // Clean up special characters
    value = value.replace(/[^\x20-\x7E]/g, "");

    // Trim and clean the string
    value = value.trim();

    if (value === "") return "N/A";
  }

  // Format based on column name patterns
  const lowerColumn = columnName.toLowerCase();

  // Date formatting
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  // String dates
  if (
    typeof value === "string" &&
    !isNaN(Date.parse(value)) &&
    lowerColumn.includes("date")
  ) {
    return new Date(value).toLocaleDateString();
  }

  // Number formatting
  if (typeof value === "number") {
    // Currency fields
    if (
      lowerColumn.includes("price") ||
      lowerColumn.includes("cost") ||
      lowerColumn.includes("revenue") ||
      lowerColumn.includes("profit") ||
      lowerColumn.includes("value") ||
      lowerColumn.includes("amount")
    ) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // Percentage fields
    if (
      lowerColumn.includes("percent") ||
      lowerColumn.includes("percentage") ||
      lowerColumn.includes("rate") ||
      lowerColumn.includes("margin")
    ) {
      return `${value.toFixed(2)}%`;
    }

    // Integer fields
    if (value % 1 === 0) {
      return value.toLocaleString();
    }

    // Decimal numbers
    return value.toFixed(2);
  }

  // Boolean values
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Arrays and objects
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

// Improved file name sanitization
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\u4e00-\u9fff_-]/g, "_") // Allow English, Arabic, Chinese characters
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 100); // Limit length
}

// Alternative simple version for quick use
export function exportPDFSimple(data: PDFData, fileName: string): void {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Agriculture Product in Cambodia Report", 14, 15);

  const sections = {
    priceTrends: "Price Trends",
    marketStats: "Market Statistics",
    productStats: "Product Statistics",
    categoryStats: "Category Statistics",
  };

  Object.keys(sections).forEach((key) => {
    const sectionData = data[key as keyof PDFData];
    if (!sectionData || sectionData.length === 0) return;

    const columns = Object.keys(sectionData[0]).map((col) =>
      formatColumnName(col)
    );
    const rows = sectionData.map((entry) =>
      Object.keys(entry).map((col) => formatCellValue(entry[col], col))
    );

    autoTable(doc, {
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 25,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.text(
      sections[key as keyof typeof sections],
      14,
      doc.lastAutoTable.finalY - 5
    );
  });

  doc.save(`${sanitizeFileName(fileName)}.pdf`);
}
