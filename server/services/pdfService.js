import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generatePdf } from "./generatePdf.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generatePdfsFromRows(rows, folder) {
  const outputDir = path.join(__dirname, "../../PDFs", folder);
  mkdirSync(outputDir, { recursive: true });

  const generatedFiles = [];

  for (const row of rows) {
    const fileName = `Voucher - ${row.Nome} - ${row.Proposta}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    await generatePdf(row, outputPath);

    generatedFiles.push({ file: fileName, data: row });
  }

  return generatedFiles;
}
