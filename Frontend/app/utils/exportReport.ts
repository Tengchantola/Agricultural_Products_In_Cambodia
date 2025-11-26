import { ReportFilters } from "../types/report";
import {
  getCategoryStats,
  getMarketStats,
  getPriceTrends,
  getProductStats,
} from "../lib/reports-api.ts";
import { exportExcel } from "./exportExcel";
import { exportCSV } from "./exportCSV";
import { exportPDF } from "./exportPDF";

export async function exportReport(
  format: "pdf" | "excel" | "csv",
  filters: ReportFilters
) {
  const [trends, markets, products, categories] = await Promise.all([
    getPriceTrends(filters),
    getMarketStats(filters),
    getProductStats(filters),
    getCategoryStats(filters),
  ]);

  const fileName = `Report_${filters.startDate}_${filters.endDate}`;

  const exportData = {
    priceTrends: trends,
    marketStats: markets,
    productStats: products,
    categoryStats: categories,
  };

  console.log(exportData);

  switch (format) {
    case "excel":
      return exportExcel(exportData, fileName);
    case "csv":
      return exportCSV(exportData, fileName);
    case "pdf":
      return exportPDF(exportData, fileName);
  }
}
