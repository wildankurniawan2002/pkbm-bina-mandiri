import db from '../config/db.js';

function extractYearFromNis(nis, fallbackDate) {
  const match = String(nis || '').match(/PKBM-(\d{4})-/);
  if (match) return match[1];
  return new Date(fallbackDate || Date.now()).getFullYear().toString();
}

function buildNis(year, sequence) {
  return `PKBM-${year}-${String(sequence).padStart(4, '0')}`;
}

async function main() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(`
      SELECT id, nis, created_at
      FROM warga_belajar
      ORDER BY created_at ASC, id ASC
    `);

    const groupedByYear = new Map();

    for (const row of rows) {
      const year = extractYearFromNis(row.nis, row.created_at);
      const list = groupedByYear.get(year) || [];
      list.push(row);
      groupedByYear.set(year, list);
    }

    const updates = [];

    for (const [year, students] of groupedByYear.entries()) {
      for (const [index, student] of students.entries()) {
        const nextNis = buildNis(year, index + 1);
        if (student.nis !== nextNis) {
          await connection.query(
            `UPDATE warga_belajar SET nis = ? WHERE id = ?`,
            [nextNis, student.id]
          );
          updates.push({
            id: student.id,
            old_nis: student.nis,
            new_nis: nextNis,
          });
        }
      }
    }

    await connection.commit();
    console.log(JSON.stringify({ success: true, updated: updates }, null, 2));
  } catch (error) {
    await connection.rollback();
    console.error('[fix-nis-sequence] Error:', error);
    process.exitCode = 1;
  } finally {
    connection.release();
    await db.end();
  }
}

main();
