// Import this module only when someone requests a PDF.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function saveBrief(title, company, sections) {
  const doc = await PDFDocument.create();
  doc.setTitle(company + " — " + title);
  doc.setCreator("GrowUp");
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const ink = rgb(0.04, 0.18, 0.19),
    teal = rgb(0.08, 0.42, 0.42);
  const width = 595,
    height = 842,
    left = 48,
    usable = width - 2 * left;
  let page, y;
  function newPage() {
    page = doc.addPage([width, height]);
    page.drawText("GrowUp  /  Agency hiring", {
      x: left,
      y: height - 42,
      size: 10,
      font: bold,
      color: teal,
    });
    page.drawLine({
      start: { x: left, y: height - 52 },
      end: { x: width - left, y: height - 52 },
      color: teal,
      thickness: 0.7,
    });
    page.drawText(String(doc.getPageCount()), {
      x: width - left - 12,
      y: 26,
      size: 9,
      font: regular,
      color: ink,
    });
    y = height - 82;
  }
  function measure(text, font, size) {
    try {
      return font.widthOfTextAtSize(text, size);
    } catch {
      ctx.font = (font === bold ? "bold " : "") + size + "px sans-serif";
      return ctx.measureText(text).width;
    }
  }
  async function line(text, font, size, color) {
    if (y < 55) newPage();
    try {
      font.encodeText(text);
      page.drawText(text, { x: left, y, size, font, color });
    } catch {
      // Preserve scripts and symbols outside the built-in PDF typeface.
      const w = Math.max(1, Math.ceil(measure(text, font, size)) + 4),
        h = size * 2;
      canvas.width = w * 3;
      canvas.height = h * 3;
      ctx.scale(3, 3);
      ctx.font = (font === bold ? "bold " : "") + size + "px sans-serif";
      ctx.fillStyle = "#123637";
      ctx.fillText(text, 0, size * 1.35);
      const image = await doc.embedPng(canvas.toDataURL("image/png"));
      page.drawImage(image, {
        x: left,
        y: y - size * 0.65,
        width: w,
        height: h,
      });
    }
    y -= size * 1.5;
  }
  async function paragraph(text, font, size, color) {
    for (const para of text
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0008\u000b-\u001f]/g, " ")
      .split("\n")) {
      let buffer = "";
      for (const word of para.trim().split(/\s+/)) {
        const next = buffer ? buffer + " " + word : word;
        if (measure(next, font, size) <= usable) {
          buffer = next;
          continue;
        }
        if (buffer) {
          await line(buffer, font, size, color);
          buffer = "";
        }
        for (const char of word) {
          if (buffer && measure(buffer + char, font, size) > usable) {
            await line(buffer, font, size, color);
            buffer = "";
          }
          buffer += char;
        }
      }
      await line(buffer, font, size, color);
    }
  }
  newPage();
  await paragraph(title, bold, 23, ink);
  await paragraph(company, regular, 14, teal);
  for (const [name, body] of sections) {
    y -= 13;
    if (y < 96) newPage();
    await paragraph(name, bold, 14, teal);
    await paragraph(body, regular, 11, ink);
  }
  const bytes = await doc.save();
  const url = URL.createObjectURL(
    new Blob([bytes], { type: "application/pdf" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download =
    (company + " " + title)
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 110) + ".pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
