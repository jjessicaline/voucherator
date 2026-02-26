import { PDFDocument, rgb } from "pdf-lib";
import { writeFile } from "fs/promises";
import fontkit from "@pdf-lib/fontkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load assets
const BarlowBoldSrc = fs.readFileSync(
  path.join(__dirname, "../assets/Barlow-Bold.ttf"),
);
const BarlowSemiBoldSrc = fs.readFileSync(
  path.join(__dirname, "../assets/Barlow-SemiBold.ttf"),
);
const Logo = fs.readFileSync(path.join(__dirname, "../assets/logo.png"));

const LogoW = 48.75; // in points
const LogoH = 25.5; // in points

const W = 595; // A4 width in points
const H = 842; // A4 height in points
const yf = (topY) => H - topY; // flip y-axis (pdf-lib origin is bottom-left)

const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);
const DARK = rgb(0.1, 0.1, 0.1);
const GRAY = rgb(0.45, 0.45, 0.45);
const BLUE = rgb(21 / 255, 95 / 255, 151 / 255);
const DIVIDER = rgb(0.85, 0.85, 0.85);

const LABEL_RIGHT = 89;
const VALUE_LEFT = LABEL_RIGHT + 15;

function wrapText(text, font, size, maxWidth) {
  const words = String(text ?? "")
    .replace(/\u2028/g, " ") // strip line separator chars from CSV
    .split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if (!word) continue;
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
function centerText(page, font, text, topY, size = 11, color = BLACK) {
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: page.getWidth() / 2 - textWidth / 2,
    y: topY,
    size,
    font,
    color,
  });
}

function drawLabel(page, font, label, topY, size = 11) {
  const textWidth = font.widthOfTextAtSize(label, size);
  const startX = LABEL_RIGHT - textWidth;
  page.drawText(label, {
    x: startX,
    y: yf(topY),
    size,
    font,
    color: GRAY,
  });
}

function drawValue(page, font, value, topY, size = 11, maxWidth = 450) {
  const lines = wrapText(value, font, size, maxWidth);
  lines.forEach((line, i) => {
    page.drawText(line, {
      x: VALUE_LEFT,
      y: yf(topY + i * 14),
      size,
      font,
      color: BLUE,
    });
  });
  return lines.length;
}

function drawDivider(page, topY) {
  page.drawRectangle({
    x: 35,
    y: yf(topY + 1),
    width: 524,
    height: 1,
    color: DIVIDER,
  });
}

function drawSection(page, font, title, topY) {
  page.drawText(title, { x: 35, y: yf(topY), size: 14, font, color: DARK });
}

export async function generatePdf(data, outputPath) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.addPage([W, H]);
  const BarlowBold = await pdfDoc.embedFont(BarlowBoldSrc);
  const BarlowSemiBold = await pdfDoc.embedFont(BarlowSemiBoldSrc);
  const logo = await pdfDoc.embedPng(Logo);

  // ── TOP HEADER ──────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: yf(65), width: W, height: 65, color: BLACK });

  page.drawImage(logo, {
    x: page.getWidth() / 2 - LogoW,
    y: yf(20 + LogoH),
    width: LogoW,
    height: LogoH,
  });

  // ── TOP CONTENT ──────────────────────────────────────────────────────
  page.drawText(`Confira o seu voucher ${data["Proposta"] ?? ""}`, {
    x: 35,
    y: yf(140),
    size: 26,
    font: BarlowBold,
    color: DARK,
  });

  const greetX = 35 + BarlowBold.widthOfTextAtSize("Olá, ", 13);
  page.drawText("Olá, ", {
    x: 35,
    y: yf(212),
    size: 13,
    font: BarlowBold,
    color: DARK,
  });
  page.drawText(String(data["Nome"] ?? ""), {
    x: greetX,
    y: yf(212),
    size: 14,
    font: BarlowBold,
    color: BLUE,
  });

  page.drawText(
    "Veja abaixo os dados de sua reserva para a CONMEBOL Recopa 2026",
    {
      x: 35,
      y: yf(240),
      size: 14,
      font: BarlowBold,
      color: DARK,
    },
  );

  // ── RESUMO DO PEDIDO ────────────────────────────────────────────────
  drawSection(page, BarlowBold, "Resumo do pedido", 322);
  drawDivider(page, 333);
  drawLabel(page, BarlowSemiBold, "Nome:", 361);
  drawValue(page, BarlowBold, data["Nome"], 362.5, 15);
  drawDivider(page, 382);

  // ── INFORMAÇÕES DE HOTEL ────────────────────────────────────────────
  drawSection(page, BarlowBold, "Informações de hotel", 408);

  const hotelRows = [
    ["Hotel:", data["Hotel"], 438, 438],
    ["Endereço:", data["Endereço"], 460, 460],
    ["Check In:", data["Check in"], 483, 483],
    ["Check Out:", data["Check Out"], 505, 505],
    ["Quarto:", data["Quarto"], 527, 527],
    ["Hospedes:", data["Hospedes"], 549, 549],
  ];
  for (const [label, value, ly, vy] of hotelRows) {
    drawLabel(page, BarlowSemiBold, label, ly);
    drawValue(page, BarlowSemiBold, value, vy);
  }

  // ── INFORMAÇÕES DO INGRESSO ─────────────────────────────────────────
  drawSection(page, BarlowBold, "Informações do Ingresso", 586);
  drawLabel(page, BarlowSemiBold, "Ingresso:", 607);
  drawValue(page, BarlowSemiBold, data["Tipo de Ingresso"], 607);
  drawLabel(page, BarlowSemiBold, "Quantidade:", 627);
  drawValue(page, BarlowSemiBold, String(data["Quantidade"]), 627);
  drawLabel(page, BarlowSemiBold, "OBS:", 648);
  drawValue(page, BarlowSemiBold, data["Obs"], 648);

  // ── INFORMAÇÕES GERAIS ──────────────────────────────────────────────
  page.drawText("Informações gerais:", {
    x: 220,
    y: yf(710),
    size: 11,
    font: BarlowBold,
    color: BLACK,
  });
  centerText(
    page,
    BarlowBold,
    "Para qualquer dúvida sobre sua reserva, alterações ou suporte durante sua estadia, entre em contato conosco:",
    yf(727),
    10,
  );

  // ── FOOTER ──────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width: W, height: 100, color: BLACK });

  centerText(
    page,
    BarlowBold,
    "Telefone de Atendimento (Brasil):  (21) 3802-3850",
    yf(785),
    12,
    WHITE,
  );
  centerText(
    page,
    BarlowBold,
    "E-mail de Suporte:  atendimento@absolut-sport.com.br",
    yf(802),
    12,
    WHITE,
  );

  const bytes = await pdfDoc.save();
  await writeFile(outputPath, bytes);
}
