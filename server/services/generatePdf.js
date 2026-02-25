import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFile } from "fs/promises";

export async function generatePdf(data, outputPath) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primary = rgb(0.1, 0.1, 0.18);
  const muted = rgb(0.55, 0.55, 0.55);
  const accent = rgb(0.2, 0.4, 0.8);

  // Header bar
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: accent,
  });

  page.drawText("Voucher", {
    x: 40,
    y: height - 52,
    size: 28,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Fields
  let y = height - 120;
  const labelSize = 9;
  const valueSize = 13;
  const lineGap = 8;
  const fieldGap = 28;

  for (const [key, value] of Object.entries(data)) {
    // Label
    page.drawText(String(key).toUpperCase(), {
      x: 40,
      y,
      size: labelSize,
      font: fontRegular,
      color: muted,
    });

    y -= labelSize + lineGap;

    // Value
    page.drawText(String(value), {
      x: 40,
      y,
      size: valueSize,
      font: fontBold,
      color: primary,
    });

    y -= valueSize + fieldGap;

    // Divider
    page.drawLine({
      start: { x: 40, y },
      end: { x: width - 40, y },
      thickness: 0.5,
      color: rgb(0.9, 0.9, 0.9),
    });

    y -= fieldGap;
  }

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}
