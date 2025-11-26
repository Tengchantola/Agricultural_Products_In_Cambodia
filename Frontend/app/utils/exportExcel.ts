import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExcelData {
  [sheetName: string]: Record<string, any>[];
}

interface ExportOptions {
  dateFormat?: string;
  currencySymbol?: string;
  autoFilter?: boolean;
  freezeHeaders?: boolean;
}

export function exportExcel(
  data: ExcelData,
  fileName: string,
  options: ExportOptions = {}
): void {
  try {
    // Validate input
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No data provided for export");
    }

    if (!fileName || fileName.trim() === "") {
      throw new Error("File name is required");
    }

    const workbook = XLSX.utils.book_new();

    // Process each sheet
    Object.keys(data).forEach((sheetName) => {
      const sheetData = data[sheetName];

      if (!sheetData || !Array.isArray(sheetData) || sheetData.length === 0) {
        console.warn(`No data available for sheet: ${sheetName}`);
        return;
      }

      // Format data for better Excel presentation
      const formattedData = formatSheetData(sheetData, options);

      // Create worksheet with formatted data
      const worksheet = XLSX.utils.json_to_sheet(formattedData, {
        header: getOptimizedHeaders(sheetData),
        cellDates: true,
        dateNF: options.dateFormat || "yyyy-mm-dd",
      });

      // Apply styling and formatting
      applyWorksheetFormatting(worksheet, sheetData, options);

      // Add worksheet to workbook with sanitized name
      const safeSheetName = getSafeSheetName(sheetName);
      XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
    });

    // Check if workbook has any sheets
    if (workbook.SheetNames.length === 0) {
      throw new Error("No valid data sheets to export");
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      bookSST: false, // For better performance
      compression: true, // Reduce file size
    });

    // Save file
    const sanitizedFileName = sanitizeFileName(fileName);
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${sanitizedFileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    throw new Error(
      `Failed to export Excel file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Format sheet data for better presentation
function formatSheetData(
  data: Record<string, any>[],
  options: ExportOptions
): Record<string, any>[] {
  return data.map((row) => {
    const formattedRow: Record<string, any> = {};

    Object.keys(row).forEach((key) => {
      const value = row[key];
      formattedRow[formatColumnName(key)] = formatCellValue(
        value,
        key,
        options
      );
    });

    return formattedRow;
  });
}

// Get optimized headers in logical order
function getOptimizedHeaders(data: Record<string, any>[]): string[] {
  if (data.length === 0) return [];

  const headers = Object.keys(data[0]);

  // Sort headers for better organization
  return headers
    .sort((a, b) => {
      const priorityA = getHeaderPriority(a);
      const priorityB = getHeaderPriority(b);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return a.localeCompare(b);
    })
    .map(formatColumnName);
}

// Priority for header ordering
function getHeaderPriority(header: string): number {
  const lowerHeader = header.toLowerCase();

  // High priority fields (IDs, names, dates)
  if (
    lowerHeader.includes("id") ||
    lowerHeader.includes("name") ||
    lowerHeader.includes("date") ||
    lowerHeader.includes("code")
  ) {
    return 1;
  }

  // Medium priority (descriptive fields)
  if (
    lowerHeader.includes("description") ||
    lowerHeader.includes("note") ||
    lowerHeader.includes("comment") ||
    lowerHeader.includes("remark")
  ) {
    return 2;
  }

  // Low priority (numeric/calculated fields)
  if (
    lowerHeader.includes("price") ||
    lowerHeader.includes("amount") ||
    lowerHeader.includes("total") ||
    lowerHeader.includes("count") ||
    lowerHeader.includes("percent") ||
    lowerHeader.includes("rate")
  ) {
    return 3;
  }

  return 4; // Other fields
}

// Apply worksheet formatting
function applyWorksheetFormatting(
  worksheet: XLSX.WorkSheet,
  data: Record<string, any>[],
  options: ExportOptions
): void {
  if (!worksheet["!ref"]) return;

  // Get the range of cells
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  // Set column widths based on content
  if (!worksheet["!cols"]) {
    worksheet["!cols"] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      const header = XLSX.utils.encode_col(col);
      const maxLength = getMaxColumnLength(data, col, header);
      worksheet["!cols"].push({ width: Math.min(Math.max(maxLength, 10), 50) });
    }
  }

  // Add auto-filter to headers
  if (options.autoFilter !== false) {
    worksheet["!autofilter"] = {
      ref: XLSX.utils.encode_range({
        s: { r: range.s.r, c: range.s.c },
        e: { r: range.s.r, c: range.e.c },
      }),
    };
  }

  // Freeze header row
  if (options.freezeHeaders !== false) {
    worksheet["!freeze"] = {
      xSplit: 0,
      ySplit: 1,
      topLeftCell: "A2",
      activePane: "bottomLeft",
    };
  }
}

// Get maximum column length for auto-width
function getMaxColumnLength(
  data: Record<string, any>[],
  colIndex: number,
  header: string
): number {
  const headerLength = header.length;
  let maxDataLength = 0;

  data.forEach((row) => {
    const keys = Object.keys(row);
    if (keys[colIndex]) {
      const value = formatCellValue(row[keys[colIndex]], keys[colIndex], {});
      maxDataLength = Math.max(maxDataLength, String(value).length);
    }
  });

  return Math.max(headerLength, maxDataLength) + 2; // Add padding
}

// Format column names (reuse from PDF version)
function formatColumnName(column: string): string {
  if (!column) return "Field";

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
    createdAt: "Created Date",
    updatedAt: "Updated Date",
    status: "Status",
    type: "Type",
  };

  const lowerColumn = column.toLowerCase();
  for (const [key, value] of Object.entries(commonNames)) {
    if (lowerColumn === key.toLowerCase()) {
      return value;
    }
  }

  return column
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

// Format cell values for Excel
function formatCellValue(
  value: any,
  columnName: string,
  options: ExportOptions
): any {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  // Handle special characters
  if (typeof value === "string") {
    value = value.replace(/[^\x20-\x7E]/g, "").trim();
    if (value === "") return "N/A";
  }

  const lowerColumn = columnName.toLowerCase();

  // Date formatting
  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === "string" &&
    !isNaN(Date.parse(value)) &&
    lowerColumn.includes("date")
  ) {
    return new Date(value);
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
      return value; // Excel will format as currency
    }

    // Percentage fields
    if (
      lowerColumn.includes("percent") ||
      lowerColumn.includes("percentage") ||
      lowerColumn.includes("rate") ||
      lowerColumn.includes("margin")
    ) {
      return value / 100; // Convert to decimal for Excel percentage format
    }

    return value;
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

  return value;
}

// Get safe sheet name (Excel has restrictions)
function getSafeSheetName(sheetName: string): string {
  return (
    sheetName
      .replace(/[\\/*\[\]:?]/g, "") // Remove invalid characters
      .substring(0, 31) // Max 31 characters
      .trim() || "Sheet1"
  );
}

// Sanitize file name
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\u4e00-\u9fff\s_-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100);
}

// Simple version for quick use
export function exportExcelSimple(data: ExcelData, fileName: string): void {
  const workbook = XLSX.utils.book_new();

  Object.keys(data).forEach((sheetName) => {
    const sheetData = data[sheetName];
    if (!sheetData || sheetData.length === 0) return;

    const formattedData = sheetData.map((row) => {
      const formattedRow: Record<string, any> = {};
      Object.keys(row).forEach((key) => {
        formattedRow[formatColumnName(key)] = row[key];
      });
      return formattedRow;
    });

    const sheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, sheet, getSafeSheetName(sheetName));
  });

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${sanitizeFileName(fileName)}.xlsx`
  );
}
