import pool from '../config/db.js';

const UjianAdministrasiModel = {
  findAllPeriode: async ({ is_active = null, tahun_ajaran_id = null } = {}) => {
    let sql = `
      SELECT
        pu.*,
        ta.nama_tahun_ajaran
      FROM periode_ujian pu
      JOIN tahun_ajaran ta ON ta.id = pu.tahun_ajaran_id
      WHERE 1=1
    `;
    const params = [];

    if (is_active !== null) {
      sql += ' AND pu.is_active = ?';
      params.push(is_active);
    }

    if (tahun_ajaran_id) {
      sql += ' AND pu.tahun_ajaran_id = ?';
      params.push(tahun_ajaran_id);
    }

    sql += ' ORDER BY pu.tahun_ajaran_id DESC, pu.tanggal_mulai DESC, pu.id DESC';
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  findPeriodeById: async (id) => {
    const [rows] = await pool.execute(
      `
        SELECT
          pu.*,
          ta.nama_tahun_ajaran
        FROM periode_ujian pu
        JOIN tahun_ajaran ta ON ta.id = pu.tahun_ajaran_id
        WHERE pu.id = ?
        LIMIT 1
      `,
      [id]
    );
    return rows[0] || null;
  },

  findActivePaketForPeriode: async (periode_ujian_id) => {
    const periode = await UjianAdministrasiModel.findPeriodeById(periode_ujian_id);
    if (!periode) return [];

    const [rows] = await pool.execute(
      `
        SELECT
          ? AS periode_ujian_id,
          ? AS nama_periode,
          ? AS jenis_ujian,
          ? AS semester,
          ? AS tahun_ajaran_id,
          pj.id AS paket_ujian_id,
          pj.rombel_id,
          pj.mapel_id,
          pj.jenis AS jenis_paket,
          pj.is_aktif,
          mp.nama AS nama_mapel,
          mp.kode AS kode_mapel
        FROM paket_ujian pj
        LEFT JOIN mata_pelajaran mp ON mp.id = pj.mapel_id
        WHERE pj.is_aktif = 1
          AND pj.jenis = ?
        ORDER BY pj.rombel_id ASC, pj.id ASC
      `,
      [
        periode.id,
        periode.nama_periode,
        periode.jenis_ujian,
        periode.semester,
        periode.tahun_ajaran_id,
        periode.jenis_ujian,
      ]
    );
    return rows;
  },

  findActiveWargaBelajarByRombel: async (rombel_id) => {
    const [rows] = await pool.execute(
      `
        SELECT
          wb.id,
          wb.user_id,
          wb.nis,
          wb.rombel_id,
          wb.jenjang,
          wb.is_aktif,
          u.nama_lengkap
        FROM warga_belajar wb
        JOIN users u ON u.id = wb.user_id
        WHERE wb.rombel_id = ? AND wb.is_aktif = 1
        ORDER BY u.nama_lengkap ASC
      `,
      [rombel_id]
    );
    return rows;
  },

  createPeriode: async ({ nama_periode, jenis_ujian, semester, tahun_ajaran_id, tanggal_mulai, tanggal_selesai, is_active }) => {
    const [result] = await pool.execute(
      `
        INSERT INTO periode_ujian
          (nama_periode, jenis_ujian, semester, tahun_ajaran_id, tanggal_mulai, tanggal_selesai, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [nama_periode, jenis_ujian, semester, tahun_ajaran_id, tanggal_mulai, tanggal_selesai, is_active ? 1 : 0]
    );
    return result.insertId;
  },

  updatePeriode: async (id, { nama_periode, jenis_ujian, semester, tahun_ajaran_id, tanggal_mulai, tanggal_selesai, is_active }) => {
    const [result] = await pool.execute(
      `
        UPDATE periode_ujian
        SET
          nama_periode = ?,
          jenis_ujian = ?,
          semester = ?,
          tahun_ajaran_id = ?,
          tanggal_mulai = ?,
          tanggal_selesai = ?,
          is_active = ?
        WHERE id = ?
      `,
      [nama_periode, jenis_ujian, semester, tahun_ajaran_id, tanggal_mulai, tanggal_selesai, is_active ? 1 : 0, id]
    );
    return result.affectedRows;
  },

  updatePeriodeStatus: async (id, is_active) => {
    const [result] = await pool.execute(
      `
        UPDATE periode_ujian
        SET is_active = ?
        WHERE id = ?
      `,
      [is_active ? 1 : 0, id]
    );
    return result.affectedRows;
  },

  findAllPesertaUjian: async ({ periode_ujian_id = null, rombel_id = null, status_pembayaran = null, status_kelayakan = null } = {}) => {
    let sql = `
      SELECT
        pu.id,
        pu.warga_belajar_id,
        pu.rombel_id,
        pu.periode_ujian_id,
        pu.status_pembayaran,
        pu.status_kelayakan,
        pu.verified_by,
        pu.verified_at,
        pu.catatan_verifikasi,
        pu.kartu_ujian_file,
        pu.created_at,
        pu.updated_at,
        wb.nis,
        wb.jenjang,
        wb.no_telp,
        u.nama_lengkap,
        u.email,
        r.nama_rombel,
        pe.nama_periode,
        pe.jenis_ujian,
        pe.semester,
        ta.nama_tahun_ajaran,
        verifikator.nama_lengkap AS nama_verifikator
      FROM peserta_ujian pu
      JOIN warga_belajar wb ON wb.id = pu.warga_belajar_id
      JOIN users u ON u.id = wb.user_id
      JOIN rombel r ON r.id = pu.rombel_id
      JOIN periode_ujian pe ON pe.id = pu.periode_ujian_id
      JOIN tahun_ajaran ta ON ta.id = pe.tahun_ajaran_id
      LEFT JOIN users verifikator ON verifikator.id = pu.verified_by
      WHERE 1=1
    `;
    const params = [];

    if (periode_ujian_id) {
      sql += ' AND pu.periode_ujian_id = ?';
      params.push(periode_ujian_id);
    }
    if (rombel_id) {
      sql += ' AND pu.rombel_id = ?';
      params.push(rombel_id);
    }
    if (status_pembayaran) {
      sql += ' AND pu.status_pembayaran = ?';
      params.push(status_pembayaran);
    }
    if (status_kelayakan) {
      sql += ' AND pu.status_kelayakan = ?';
      params.push(status_kelayakan);
    }

    sql += ' ORDER BY pe.tanggal_mulai DESC, r.nama_rombel ASC, u.nama_lengkap ASC';
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  findPesertaUjianById: async (id) => {
    const [rows] = await pool.execute(
      `
        SELECT
          pu.id,
          pu.warga_belajar_id,
          pu.rombel_id,
          pu.periode_ujian_id,
          pu.status_pembayaran,
          pu.status_kelayakan,
          pu.verified_by,
          pu.verified_at,
          pu.catatan_verifikasi,
          pu.kartu_ujian_file,
          pu.created_at,
          pu.updated_at,
          wb.nis,
          wb.jenjang,
          wb.no_telp,
          u.id AS user_id,
          u.nama_lengkap,
          u.email,
          u.foto_profil,
          r.nama_rombel,
          pe.nama_periode,
          pe.jenis_ujian,
          pe.semester,
          ta.nama_tahun_ajaran,
          verifikator.nama_lengkap AS nama_verifikator
        FROM peserta_ujian pu
        JOIN warga_belajar wb ON wb.id = pu.warga_belajar_id
        JOIN users u ON u.id = wb.user_id
        JOIN rombel r ON r.id = pu.rombel_id
        JOIN periode_ujian pe ON pe.id = pu.periode_ujian_id
        JOIN tahun_ajaran ta ON ta.id = pe.tahun_ajaran_id
        LEFT JOIN users verifikator ON verifikator.id = pu.verified_by
        WHERE pu.id = ?
        LIMIT 1
      `,
      [id]
    );
    return rows[0] || null;
  },

  findPesertaUjianMapel: async (peserta_ujian_id) => {
    const [rows] = await pool.execute(
      `
        SELECT
          pum.id,
          pum.peserta_ujian_id,
          pum.mapel_id,
          pum.paket_ujian_id,
          pum.created_at,
          mp.nama AS nama_mapel,
          mp.kode AS kode_mapel,
          pj.judul AS judul_paket_ujian,
          pj.jenis AS jenis_paket_ujian
        FROM peserta_ujian_mapel pum
        JOIN mata_pelajaran mp ON mp.id = pum.mapel_id
        JOIN paket_ujian pj ON pj.id = pum.paket_ujian_id
        WHERE pum.peserta_ujian_id = ?
        ORDER BY mp.nama ASC
      `,
      [peserta_ujian_id]
    );
    return rows;
  },

  findPesertaUjianByUserId: async (user_id) => {
    const [rows] = await pool.execute(
      `
        SELECT
          pu.id,
          pu.warga_belajar_id,
          pu.rombel_id,
          pu.periode_ujian_id,
          pu.status_pembayaran,
          pu.status_kelayakan,
          pu.verified_by,
          pu.verified_at,
          pu.catatan_verifikasi,
          pu.kartu_ujian_file,
          pu.created_at,
          pu.updated_at,
          wb.nis,
          wb.jenjang,
          wb.no_telp,
          u.nama_lengkap,
          u.email,
          u.foto_profil,
          r.nama_rombel,
          pe.nama_periode,
          pe.jenis_ujian,
          pe.semester,
          ta.nama_tahun_ajaran
        FROM peserta_ujian pu
        JOIN warga_belajar wb ON wb.id = pu.warga_belajar_id
        JOIN users u ON u.id = wb.user_id
        JOIN rombel r ON r.id = pu.rombel_id
        JOIN periode_ujian pe ON pe.id = pu.periode_ujian_id
        JOIN tahun_ajaran ta ON ta.id = pe.tahun_ajaran_id
        WHERE wb.user_id = ? AND pe.is_active = 1
        ORDER BY pe.tanggal_mulai DESC, pu.id DESC
        LIMIT 1
      `,
      [user_id]
    );
    return rows[0] || null;
  },

  findPesertaUjianByWbAndPeriode: async (warga_belajar_id, periode_ujian_id) => {
    const [rows] = await pool.execute(
      `
        SELECT id, warga_belajar_id, rombel_id, periode_ujian_id
        FROM peserta_ujian
        WHERE warga_belajar_id = ? AND periode_ujian_id = ?
        LIMIT 1
      `,
      [warga_belajar_id, periode_ujian_id]
    );
    return rows[0] || null;
  },

  findPesertaUjianMapelRow: async (peserta_ujian_id, mapel_id) => {
    const [rows] = await pool.execute(
      `
        SELECT id
        FROM peserta_ujian_mapel
        WHERE peserta_ujian_id = ? AND mapel_id = ?
        LIMIT 1
      `,
      [peserta_ujian_id, mapel_id]
    );
    return rows[0] || null;
  },

  createPesertaUjian: async ({ warga_belajar_id, rombel_id, periode_ujian_id }) => {
    const [result] = await pool.execute(
      `
        INSERT INTO peserta_ujian
          (warga_belajar_id, rombel_id, periode_ujian_id, status_pembayaran, status_kelayakan, created_at)
        VALUES (?, ?, ?, 'belum_bayar', 'belum_layak', NOW())
      `,
      [warga_belajar_id, rombel_id, periode_ujian_id]
    );
    return result.insertId;
  },

  createPesertaUjianMapel: async ({ peserta_ujian_id, mapel_id, paket_ujian_id }) => {
    const [result] = await pool.execute(
      `
        INSERT INTO peserta_ujian_mapel
          (peserta_ujian_id, mapel_id, paket_ujian_id, created_at)
        VALUES (?, ?, ?, NOW())
      `,
      [peserta_ujian_id, mapel_id, paket_ujian_id]
    );
    return result.insertId;
  },

  updateStatusPembayaran: async (id, { status_pembayaran, catatan_verifikasi, verified_by, verified_at }) => {
    const [result] = await pool.execute(
      `
        UPDATE peserta_ujian
        SET
          status_pembayaran = ?,
          status_kelayakan = CASE WHEN ? = 'lunas' THEN status_kelayakan ELSE 'belum_layak' END,
          catatan_verifikasi = ?,
          verified_by = ?,
          verified_at = ?
        WHERE id = ?
      `,
      [status_pembayaran, status_pembayaran, catatan_verifikasi || null, verified_by || null, verified_at || null, id]
    );
    return result.affectedRows;
  },

  updateStatusKelayakan: async (id, status_kelayakan) => {
    const [result] = await pool.execute(
      `
        UPDATE peserta_ujian
        SET status_kelayakan = ?
        WHERE id = ?
      `,
      [status_kelayakan, id]
    );
    return result.affectedRows;
  },

  updateKartuUjianFile: async (id, kartu_ujian_file) => {
    const [result] = await pool.execute(
      `
        UPDATE peserta_ujian
        SET kartu_ujian_file = ?, updated_at = NOW()
        WHERE id = ?
      `,
      [kartu_ujian_file, id]
    );
    return result.affectedRows;
  },
};

export default UjianAdministrasiModel;
