CREATE TABLE IF NOT EXISTS periode_ujian (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama_periode VARCHAR(120) NOT NULL,
  jenis_ujian ENUM('uts', 'uas') NOT NULL,
  semester ENUM('ganjil', 'genap') NOT NULL,
  tahun_ajaran_id INT UNSIGNED NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_periode_ujian_tahun_ajaran
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran(id),
  CONSTRAINT uq_periode_ujian UNIQUE (jenis_ujian, semester, tahun_ajaran_id)
);

CREATE TABLE IF NOT EXISTS peserta_ujian (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  warga_belajar_id INT UNSIGNED NOT NULL,
  rombel_id INT UNSIGNED NOT NULL,
  periode_ujian_id INT UNSIGNED NOT NULL,
  status_pembayaran ENUM('belum_bayar', 'menunggu_verifikasi', 'ditolak', 'lunas') NOT NULL DEFAULT 'belum_bayar',
  status_kelayakan ENUM('belum_layak', 'layak') NOT NULL DEFAULT 'belum_layak',
  verified_by INT UNSIGNED NULL,
  verified_at DATETIME NULL,
  catatan_verifikasi TEXT NULL,
  kartu_ujian_file VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_peserta_ujian_wb
    FOREIGN KEY (warga_belajar_id) REFERENCES warga_belajar(id),
  CONSTRAINT fk_peserta_ujian_rombel
    FOREIGN KEY (rombel_id) REFERENCES rombel(id),
  CONSTRAINT fk_peserta_ujian_periode
    FOREIGN KEY (periode_ujian_id) REFERENCES periode_ujian(id),
  CONSTRAINT fk_peserta_ujian_verified_by
    FOREIGN KEY (verified_by) REFERENCES users(id),
  CONSTRAINT uq_peserta_ujian UNIQUE (warga_belajar_id, periode_ujian_id)
);

CREATE TABLE IF NOT EXISTS peserta_ujian_mapel (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  peserta_ujian_id INT UNSIGNED NOT NULL,
  mapel_id INT UNSIGNED NOT NULL,
  paket_ujian_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_peserta_ujian_mapel_peserta
    FOREIGN KEY (peserta_ujian_id) REFERENCES peserta_ujian(id) ON DELETE CASCADE,
  CONSTRAINT fk_peserta_ujian_mapel_mapel
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id),
  CONSTRAINT fk_peserta_ujian_mapel_paket
    FOREIGN KEY (paket_ujian_id) REFERENCES paket_ujian(id),
  CONSTRAINT uq_peserta_ujian_mapel UNIQUE (peserta_ujian_id, mapel_id)
);

CREATE INDEX idx_periode_ujian_active ON periode_ujian(is_active, tahun_ajaran_id);
CREATE INDEX idx_peserta_ujian_status ON peserta_ujian(periode_ujian_id, status_pembayaran, status_kelayakan);
CREATE INDEX idx_peserta_ujian_wb ON peserta_ujian(warga_belajar_id);
