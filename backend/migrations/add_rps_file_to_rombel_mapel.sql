-- ============================================================
-- Migration: Tambah kolom rps_file_path ke tabel rombel_mapel
-- Kolom ini menyimpan path file RPS (Rencana Pembelajaran
-- Semester) yang diupload oleh Tutor untuk setiap mapel
-- dalam suatu rombel.
-- ============================================================

ALTER TABLE rombel_mapel
  ADD COLUMN rps_file_path VARCHAR(500) DEFAULT NULL
  AFTER urutan;
