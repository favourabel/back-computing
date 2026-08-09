import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

/* ============================================================================
   parseStudentFile — Supports both CSV and XLSX uploads
   ============================================================================
   Columns expected: MatNumber | FullNames | Programme
   Header row is automatically skipped if detected.
   Returns an array of { matNumber, fullName, programme }
   ============================================================================ */

/* -------------------------------------------------------------------------
   CSV Parser — your original logic, 100% untouched
   ------------------------------------------------------------------------- */
function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const results = [];

  for (const line of lines) {
    const columns = line.split(",").map((col) => col.trim());

    const [col1, col2, col3] = columns;

    // ✅ Skip header row — detects if first column looks like a header
    if (
      col1?.toLowerCase() === "matnumber" ||
      col1?.toLowerCase() === "mat number" ||
      col1?.toLowerCase() === "matric" ||
      col1?.toLowerCase() === "matric number"
    ) {
      continue;
    }

    // ✅ Skip rows that don't have at least matNumber and fullName
    if (!col1 || !col2) continue;

    results.push({
      matNumber: col1.toUpperCase(),
      fullName: col2,
      programme: col3 || "", // 3rd column, empty string if missing
    });
  }

  return results;
}

/* -------------------------------------------------------------------------
   XLSX Parser — new addition
   ------------------------------------------------------------------------- */
function parseXLSX(filePath) {
  const workbook = XLSX.readFile(filePath);

  // Always read the first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet to array of arrays
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const results = [];

  for (const row of rows) {
    const col1 = row[0]?.toString().trim();
    const col2 = row[1]?.toString().trim();
    const col3 = row[2]?.toString().trim();

    // ✅ Skip header row — same detection as your CSV parser
    if (
      col1?.toLowerCase() === "matnumber" ||
      col1?.toLowerCase() === "mat number" ||
      col1?.toLowerCase() === "matric" ||
      col1?.toLowerCase() === "matric number"
    ) {
      continue;
    }

    // ✅ Skip rows that don't have at least matNumber and fullName
    if (!col1 || !col2) continue;

    results.push({
      matNumber: col1.toUpperCase(),
      fullName: col2,
      programme: col3 || "", // 3rd column, empty string if missing
    });
  }

  return results;
}

/* -------------------------------------------------------------------------
   Main Export — auto-detects file type by extension
   ------------------------------------------------------------------------- */
export function parseStudentFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".csv") {
    return parseCSV(filePath);
  }

  if (ext === ".xlsx" || ext === ".xls") {
    return parseXLSX(filePath);
  }

  // Unsupported file type
  throw new Error(
    `Unsupported file type: "${ext}". Please upload a CSV or XLSX file.`
  );
}

/* -------------------------------------------------------------------------
   Keep old export name working — so nothing else in your app breaks
   ------------------------------------------------------------------------- */
export const parseStudentCSV = parseStudentFile;