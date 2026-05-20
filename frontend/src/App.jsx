// ============================================================
// src/App.jsx — Pengatur Rute (Router) Utama Aplikasi
// ============================================================
// File ini mendefinisikan SEMUA rute/halaman yang ada di aplikasi.
// Menggunakan React Router DOM v6 (<Routes> & <Route>).
//
// Struktur Rute Lengkap:
//   /                          → Login (halaman publik)
//   /daftar                    → Formulir SPMB publik (tanpa login)
//   /dashboard                 → Redirect otomatis berdasarkan role
//   /dashboard/siswa           → Beranda Warga Belajar
//   /dashboard/siswa/materi    → Materi belajar
//   /dashboard/siswa/tugas     → Tugas & pengumpulan
//   /dashboard/siswa/absensi   → Check-in absensi mandiri
//   /dashboard/siswa/ujian     → Ujian online
//   /dashboard/siswa/klub      → Klub minat bakat
//   /dashboard/siswa/tagihan   → Tagihan SPP
//   /dashboard/admin           → Beranda Admin TU
//   /dashboard/admin/spmb      → Verifikasi SPMB
//   /dashboard/admin/siswa     → Manajemen data WB
//   /dashboard/admin/tagihan   → Keuangan & tagihan
//   /dashboard/admin/users     → Manajemen akun (Super Admin)
//   /dashboard/tutor           → Beranda Tutor
//   /dashboard/tutor/kelas     → Materi, tugas & jadwal
//   /dashboard/tutor/absensi   → Kelola absensi dual-mode
//   /dashboard/tutor/ujian     → Bank soal & paket ujian
//   /dashboard/pimpinan        → Dashboard eksekutif (view-only)
//   *                          → Halaman 404
// ============================================================

import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// ── Halaman Publik (tidak butuh login) ──────────────────────
const LoginPage = lazy(() => import('./pages/public/LoginPage.jsx'));
const DaftarSpmbPage = lazy(() => import('./pages/public/DaftarSpmbPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage.jsx'));

// ── Komponen Pendukung ───────────────────────────────────────
import ProtectedRoute  from './components/ProtectedRoute.jsx';
const DashboardRouter = lazy(() => import('./pages/DashboardRouter.jsx'));

// ── Halaman Warga Belajar ────────────────────────────────────
const DashboardSiswa = lazy(() => import('./pages/siswa/DashboardSiswa.jsx'));
const RuangBelajarSiswa = lazy(() => import('./pages/siswa/RuangBelajarSiswa.jsx'));
const KelasTerpaduSiswa = lazy(() => import('./pages/siswa/KelasTerpaduSiswa.jsx'));
const MateriSiswa = lazy(() => import('./pages/siswa/MateriSiswa.jsx'));
const TugasSiswa = lazy(() => import('./pages/siswa/TugasSiswa.jsx'));
const AbsensiSiswa = lazy(() => import('./pages/siswa/AbsensiSiswa.jsx'));
const UjianSiswa = lazy(() => import('./pages/siswa/UjianSiswa.jsx'));
const KlubSiswa = lazy(() => import('./pages/siswa/KlubSiswa.jsx'));
const TagihanSiswa = lazy(() => import('./pages/siswa/TagihanSiswa.jsx'));

// ── Halaman Admin TU & Keuangan ──────────────────────────────
const DashboardAdmin = lazy(() => import('./pages/admin/DashboardAdmin.jsx'));
const SpmbAdmin = lazy(() => import('./pages/admin/SpmbAdmin.jsx'));
const SiswaAdmin = lazy(() => import('./pages/admin/SiswaAdmin.jsx'));
const TagihanAdmin = lazy(() => import('./pages/admin/TagihanAdmin.jsx'));
const UserAdmin = lazy(() => import('./pages/admin/UserAdmin.jsx'));
const KlubAdmin = lazy(() => import('./pages/admin/KlubAdmin.jsx'));
const MasterMapelAdmin = lazy(() => import('./pages/admin/MasterMapelAdmin.jsx'));
const MapelPerRombelAdmin = lazy(() => import('./pages/admin/MapelPerRombelAdmin.jsx'));
const PeriodeUjianAdmin = lazy(() => import('./pages/admin/PeriodeUjianAdmin.jsx'));
const PesertaUjianAdmin = lazy(() => import('./pages/admin/PesertaUjianAdmin.jsx'));

// ── Halaman Tutor ────────────────────────────────────────────
const DashboardTutor = lazy(() => import('./pages/tutor/DashboardTutor.jsx'));
const KelasTutor = lazy(() => import('./pages/tutor/KelasTutor.jsx'));
const AbsensiTutor = lazy(() => import('./pages/tutor/AbsensiTutor.jsx'));
const UjianTutor = lazy(() => import('./pages/tutor/UjianTutor.jsx'));

// ── Halaman Pimpinan ─────────────────────────────────────────
const DashboardPimpinan = lazy(() => import('./pages/pimpinan/DashboardPimpinan.jsx'));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: 600 }}>
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}

function SeoMetaManager() {
  const location = useLocation();

  useEffect(() => {
    const descriptionTag = document.querySelector('meta[name="description"]');
    const robotsTag = document.querySelector('meta[name="robots"]');
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    const twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
    const twitterImageTag = document.querySelector('meta[name="twitter:image"]');
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    let structuredDataTag = document.querySelector('script[data-seo-ld="pkbm"]');

    const path = location.pathname;
    const pageUrl = `${window.location.origin}${path}`;
    const imageUrl = `${window.location.origin}/favicon.svg`;

    let title = 'PKBM Bina Mandiri';
    let description = 'Platform digital PKBM Bina Mandiri untuk pendaftaran, pembelajaran, ujian, dan administrasi pendidikan nonformal.';
    let robots = 'index, follow';

    if (path === '/') {
      title = 'Login | PKBM Bina Mandiri';
      description = 'Masuk ke platform digital PKBM Bina Mandiri untuk mengakses pembelajaran, administrasi, dan layanan pendidikan.';
    } else if (path === '/daftar') {
      title = 'Pendaftaran Warga Belajar Baru | PKBM Bina Mandiri';
      description = 'Daftar sebagai warga belajar baru PKBM Bina Mandiri secara online untuk Paket A, Paket B, dan Paket C.';
    } else if (path.startsWith('/dashboard')) {
      title = 'Dashboard | PKBM Bina Mandiri';
      description = 'Area dashboard internal PKBM Bina Mandiri untuk pengguna yang sudah masuk.';
      robots = 'index, follow';
    }

    document.title = title;
    if (descriptionTag) descriptionTag.setAttribute('content', description);
    if (robotsTag) robotsTag.setAttribute('content', robots);
    if (ogTitleTag) ogTitleTag.setAttribute('content', title);
    if (ogDescriptionTag) ogDescriptionTag.setAttribute('content', description);
    if (ogUrlTag) ogUrlTag.setAttribute('content', pageUrl);
    if (ogImageTag) ogImageTag.setAttribute('content', imageUrl);
    if (twitterTitleTag) twitterTitleTag.setAttribute('content', title);
    if (twitterDescriptionTag) twitterDescriptionTag.setAttribute('content', description);
    if (twitterImageTag) twitterImageTag.setAttribute('content', imageUrl);

    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', pageUrl);

    const structuredData = path === '/daftar'
      ? {
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'PKBM Bina Mandiri',
          url: window.location.origin,
          description,
          image: imageUrl,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'PKBM Bina Mandiri',
          url: window.location.origin,
          description,
        };

    if (!structuredDataTag) {
      structuredDataTag = document.createElement('script');
      structuredDataTag.type = 'application/ld+json';
      structuredDataTag.setAttribute('data-seo-ld', 'pkbm');
      document.head.appendChild(structuredDataTag);
    }
    structuredDataTag.textContent = JSON.stringify(structuredData);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SeoMetaManager />
      {/* <Routes> adalah penampung semua definisi <Route> */}
      <Routes>

        {/* ════════════════════════════════════════════════════ */}
        {/* RUTE PUBLIK — tidak perlu login                      */}
        {/* ════════════════════════════════════════════════════ */}
        <Route path="/"       element={<LoginPage />} />
        <Route path="/daftar" element={<DaftarSpmbPage />} />

        {/* /dashboard → redirect otomatis sesuai role */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

        {/* ════════════════════════════════════════════════════ */}
        {/* RUTE WARGA BELAJAR                                   */}
        {/* ════════════════════════════════════════════════════ */}
        <Route path="/dashboard/siswa"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><DashboardSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/ruang-belajar"
          element={<ProtectedRoute allowedRoles={['warga_belajar', 'tutor', 'admin', 'super_admin']}><RuangBelajarSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/kelas/:mapelId"
          element={<ProtectedRoute allowedRoles={['warga_belajar', 'tutor', 'admin', 'super_admin']}><KelasTerpaduSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/materi"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><MateriSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/tugas"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><TugasSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/absensi"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><AbsensiSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/ujian"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><UjianSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/klub"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><KlubSiswa /></ProtectedRoute>} />
        <Route path="/dashboard/siswa/tagihan"
          element={<ProtectedRoute allowedRoles={['warga_belajar']}><TagihanSiswa /></ProtectedRoute>} />

        {/* ════════════════════════════════════════════════════ */}
        {/* RUTE ADMIN TU & KEUANGAN                             */}
        {/* ════════════════════════════════════════════════════ */}
        <Route path="/dashboard/admin"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/spmb"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><SpmbAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/siswa"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><SiswaAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/master-mapel"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><MasterMapelAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/mapel-rombel"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><MapelPerRombelAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/periode-ujian"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PeriodeUjianAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/peserta-ujian"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PesertaUjianAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/admin/tagihan"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TagihanAdmin /></ProtectedRoute>} />
        {/* Hanya Super Admin yang bisa akses manajemen user */}
        <Route path="/dashboard/admin/users"
          element={<ProtectedRoute allowedRoles={['super_admin']}><UserAdmin /></ProtectedRoute>} />
        {/* Admin & Super Admin kelola klub minat bakat */}
        <Route path="/dashboard/admin/klub"
          element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><KlubAdmin /></ProtectedRoute>} />

        {/* ════════════════════════════════════════════════════ */}
        {/* RUTE TUTOR                                           */}
        {/* ════════════════════════════════════════════════════ */}
        <Route path="/dashboard/tutor"
          element={<ProtectedRoute allowedRoles={['tutor', 'super_admin']}><DashboardTutor /></ProtectedRoute>} />
        <Route path="/dashboard/tutor/kelas"
          element={<ProtectedRoute allowedRoles={['tutor', 'super_admin']}><KelasTutor /></ProtectedRoute>} />
        <Route path="/dashboard/tutor/absensi"
          element={<ProtectedRoute allowedRoles={['tutor', 'super_admin']}><AbsensiTutor /></ProtectedRoute>} />
        <Route path="/dashboard/tutor/ujian"
          element={<ProtectedRoute allowedRoles={['tutor', 'super_admin']}><UjianTutor /></ProtectedRoute>} />

        {/* ════════════════════════════════════════════════════ */}
        {/* RUTE PIMPINAN                                        */}
        {/* ════════════════════════════════════════════════════ */}
        <Route path="/dashboard/pimpinan"
          element={<ProtectedRoute allowedRoles={['pimpinan', 'super_admin']}><DashboardPimpinan /></ProtectedRoute>} />

        {/* Fallback: halaman 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
}

export default App;
