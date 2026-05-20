import db from '../config/db.js';

function shouldAttachMapelToRombel(mapelJenjang, rombelJenjang) {
  return mapelJenjang === 'semua' || mapelJenjang === rombelJenjang;
}

async function main() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rombels] = await connection.query(
      `
        SELECT id, nama_rombel, jenjang, tutor_wali_id
        FROM rombel
        ORDER BY jenjang ASC, nama_rombel ASC
      `
    );

    const [mapelList] = await connection.query(
      `
        SELECT id, kode, nama, jenjang
        FROM mata_pelajaran
        WHERE is_active = 1
        ORDER BY
          CASE WHEN jenjang = 'semua' THEN 0 ELSE 1 END,
          nama ASC
      `
    );

    const [tutors] = await connection.query(
      `
        SELECT id
        FROM users
        WHERE role = 'tutor' AND is_active = 1
        ORDER BY id ASC
        LIMIT 1
      `
    );

    const defaultTutorId = tutors[0]?.id || null;
    let insertedCount = 0;

    for (const rombel of rombels) {
      const tutorId = rombel.tutor_wali_id || defaultTutorId;
      const matchingMapel = mapelList.filter((mapel) =>
        shouldAttachMapelToRombel(mapel.jenjang, rombel.jenjang)
      );

      for (const [index, mapel] of matchingMapel.entries()) {
        const [existing] = await connection.query(
          `
            SELECT id
            FROM rombel_mapel
            WHERE rombel_id = ? AND mapel_id = ?
            LIMIT 1
          `,
          [rombel.id, mapel.id]
        );

        if (existing.length > 0) {
          continue;
        }

        await connection.query(
          `
            INSERT INTO rombel_mapel (rombel_id, mapel_id, tutor_id, is_visible, urutan, created_at)
            VALUES (?, ?, ?, 1, ?, NOW())
          `,
          [rombel.id, mapel.id, tutorId, index + 1]
        );

        insertedCount += 1;
      }
    }

    await connection.commit();

    console.log(
      JSON.stringify(
        {
          success: true,
          insertedCount,
          defaultTutorId,
          totalRombel: rombels.length,
          totalMapelAktif: mapelList.length,
        },
        null,
        2
      )
    );
  } catch (error) {
    await connection.rollback();
    console.error('[seed-rombel-mapel] Error:', error);
    process.exitCode = 1;
  } finally {
    connection.release();
    await db.end();
  }
}

main();
