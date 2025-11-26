import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export function exportCSV(data, fileName: string) {
  const sheet = XLSX.utils.json_to_sheet(data.productStats);
  const csv = XLSX.utils.sheet_to_csv(sheet);

  saveAs(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    `${fileName}.csv`
  );
}
