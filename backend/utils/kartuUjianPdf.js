import fs from 'fs/promises';
import path from 'path';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

const sanitizeText = (value) => {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ')
    .trim();
};

const wrapText = (text, maxChars = 70) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return ['-'];

  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : ['-'];
};

const buildPdfBuffer = (commands) => {
  const content = commands.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Count 1 /Kids [3 0 R] >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
};

const textLine = (font, size, x, y, text) =>
  `BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${sanitizeText(text)}) Tj ET`;

const rectFill = (x, y, width, height, r, g, b) =>
  `${r} ${g} ${b} rg ${x} ${y} ${width} ${height} re f`;

const rectStroke = (x, y, width, height, r, g, b, lineWidth = 1) =>
  `${lineWidth} w ${r} ${g} ${b} RG ${x} ${y} ${width} ${height} re S`;

const lineStroke = (x1, y1, x2, y2, r, g, b, lineWidth = 1) =>
  `${lineWidth} w ${r} ${g} ${b} RG ${x1} ${y1} m ${x2} ${y2} l S`;

export const buildKartuUjianPdf = async ({ peserta, mapel, outputPath }) => {
  const periodeLabel = [peserta.nama_periode, peserta.nama_tahun_ajaran].filter(Boolean).join(' - ');
  const jenisLabel = `${String(peserta.jenis_ujian || '').toUpperCase()} ${String(peserta.semester || '').replace(/\b\w/g, (char) => char.toUpperCase())}`.trim();
  const phone = peserta.no_telp || '-';
  const jenjang = peserta.jenjang ? String(peserta.jenjang).replaceAll('_', ' ').toUpperCase() : '-';
  const lines = [];

  lines.push(rectFill(32, 724, 531, 88, 0.10, 0.43, 0.24));
  lines.push(rectStroke(32, 60, 531, 752, 0.82, 0.88, 0.84, 1));
  lines.push(textLine('F2', 14, 52, 785, 'PKBM BINA MANDIRI'));
  lines.push(textLine('F1', 10, 52, 770, 'Kartu peserta ujian resmi'));
  lines.push(textLine('F2', 24, 52, 742, 'KARTU UJIAN'));
  lines.push(textLine('F1', 11, 52, 726, periodeLabel || 'Periode ujian'));

  let y = 682;
  const infoPairs = [
    ['Nama Peserta', peserta.nama_lengkap || '-'],
    ['NIS', peserta.nis || '-'],
    ['Jenjang', jenjang],
    ['Rombel', peserta.nama_rombel || '-'],
    ['No. Telepon', phone],
    ['Jenis Ujian', jenisLabel || '-'],
    ['Status Pembayaran', peserta.status_pembayaran || '-'],
    ['Status Kelayakan', peserta.status_kelayakan || '-'],
  ];

  infoPairs.forEach(([label, value]) => {
    lines.push(textLine('F2', 11, 52, y, `${label}:`));
    wrapText(value, 46).forEach((part, idx) => {
      lines.push(textLine('F1', 11, 180, y - (idx * 16), part));
    });
    y -= 28;
  });

  y -= 10;
  lines.push(lineStroke(52, y, 542, y, 0.80, 0.85, 0.82, 1));
  y -= 24;
  lines.push(textLine('F2', 13, 52, y, 'DAFTAR MAPEL UJIAN'));
  y -= 22;

  mapel.forEach((item, index) => {
    const mapelLine = `${index + 1}. ${item.nama_mapel || '-'}${item.kode_mapel ? ` (${item.kode_mapel})` : ''}`;
    wrapText(mapelLine, 68).forEach((part, idx) => {
      lines.push(textLine('F1', 11, 62, y - (idx * 15), part));
    });
    if (item.judul_paket_ujian) {
      wrapText(`Paket: ${item.judul_paket_ujian}`, 64).forEach((part, idx) => {
        lines.push(textLine('F1', 9, 78, y - 14 - (idx * 13), part));
      });
      y -= 32;
    } else {
      y -= 22;
    }
  });

  y = Math.max(y - 10, 145);
  lines.push(lineStroke(52, y, 542, y, 0.80, 0.85, 0.82, 1));
  y -= 26;
  lines.push(textLine('F1', 10, 52, y, 'Catatan: Kartu ini berlaku setelah pembayaran diverifikasi lunas dan peserta dinyatakan layak ujian.'));
  y -= 18;
  lines.push(textLine('F1', 10, 52, y, 'Harap membawa kartu ini saat pelaksanaan ujian.'));
  y -= 40;
  lines.push(textLine('F1', 10, 400, y, 'PKBM Bina Mandiri'));
  y -= 16;
  lines.push(textLine('F2', 11, 392, y, 'Admin TU / Super Admin'));

  const buffer = buildPdfBuffer(lines);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buffer);
};
