import { parse } from "csv-parse/sync";
import fs from "fs";

export const parseStudentCSV = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf-8");

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  const normalized = records
    .map((row) => {
      const keys = Object.keys(row).reduce((acc, k) => {
        acc[k.toLowerCase().replace(/\s/g, "")] = row[k];
        return acc;
      }, {});

      return {
        matNumber: keys.matnumber || keys.mat || keys.matno,
        fullName: keys.fullname || keys.name,
      };
    })
    .filter((r) => r.matNumber && r.fullName);

  return normalized;
};