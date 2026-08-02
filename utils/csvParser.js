import fs from "fs";
import path from "path";

/**
 * Parses a CSV file with columns: MatNumber, FullNames, Programme
 * Header row is automatically skipped if detected.
 * Returns an array of { matNumber, fullName, programme }
 */
export function parseStudentCSV(filePath) {
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
      programme: col3 || "",   // ✅ NEW — 3rd column, empty string if missing
    });
  }

  return results;
}