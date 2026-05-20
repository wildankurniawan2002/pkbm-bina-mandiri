ALTER TABLE mata_pelajaran
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER deskripsi;

ALTER TABLE rombel_mapel
  ADD COLUMN is_visible TINYINT(1) NOT NULL DEFAULT 1 AFTER tutor_id,
  ADD COLUMN urutan INT NOT NULL DEFAULT 0 AFTER is_visible;

