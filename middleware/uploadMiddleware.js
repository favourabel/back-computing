import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// ✅ Updated — accepts both CSV and XLSX files
export const uploadFile = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "text/csv",                                                            // .csv
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  // .xlsx
      "application/vnd.ms-excel",                                            // .xls
    ];

    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV or XLSX files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit — untouched
});

// ✅ Keep old name working so nothing else breaks
export const uploadCSV = uploadFile;