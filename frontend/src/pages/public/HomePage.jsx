import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Profil", href: "#profil" },
  { label: "Program", href: "#program" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

const FEATURES = [
  { icon: "🎓", title: "Ijazah Resmi Negara", desc: "Ijazah Kesetaraan langsung dari Kemendikbud, memiliki hak eligibilitas yang sama dengan ijazah formal." },
  { icon: "⭐", title: "Terakreditasi", desc: "Lembaga resmi dan terakreditasi dengan standar pendidikan nasional yang terjamin." },
  { icon: "🕐", title: "Waktu Fleksibel", desc: "Cocok untuk kamu yang bekerja. Belajar kapan saja tanpa mengganggu aktivitas harian." },
  { icon: "🌍", title: "Bebas Domisili", desc: "Menerima pendaftaran dari seluruh Indonesia bahkan luar negeri." },
  { icon: "💰", title: "Biaya Terjangkau", desc: "Biaya pendidikan ringan dan dapat dicicil agar pendidikan mudah diakses semua kalangan." },
  { icon: "💻", title: "E-Learning System", desc: "Sistem pembelajaran online & offline yang nyaman dan efektif." },
];

const PROGRAMS = [
  {
    title: "Paket A",
    setara: "Setara SD/MI",
    desc: "Program pendidikan kesetaraan bagi yang ingin menuntaskan pendidikan setara Sekolah Dasar.",
    emoji: "📚",
    bg: "#e8f5ee",
    accent: "#1a5c38",
  },
  {
    title: "Paket B",
    setara: "Setara SMP/MTs",
    desc: "Program pendidikan kesetaraan bagi yang ingin menuntaskan pendidikan setara SMP.",
    emoji: "📖",
    bg: "#d4eddf",
    accent: "#1e6e42",
  },
  {
    title: "Paket C",
    setara: "Setara SMA/MA",
    desc: "Program pendidikan kesetaraan bagi yang ingin meraih ijazah setara SMA dan melanjutkan ke perguruan tinggi.",
    emoji: "🏫",
    bg: "#c6e6d2",
    accent: "#145c33",
  },
];

const FAQS = [
  { q: "Apakah ijazah yang didapatkan resmi?", a: "Ya, ijazah Pendidikan Kesetaraan bersifat resmi dan dikeluarkan langsung oleh Kementerian Pendidikan." },
  { q: "Apakah ada batasan usia untuk mendaftar?", a: "Tidak ada. Semua usia bisa mendaftar dan belajar bersama di PKBM Bina Mandiri." },
  { q: "Apakah lulusan Paket C bisa masuk PTN?", a: "Ya. Ijazah Paket C memiliki hak yang sama dengan lulusan SMA/SMK untuk mendaftar ke Perguruan Tinggi Negeri." },
  { q: "Bagaimana jika saya dari luar kota?", a: "PKBM Bina Mandiri menerima pendaftaran dari seluruh Indonesia. Pembelajaran dapat dilakukan secara online." },
];

const PRIMARY = "#1a5c38";
const PRIMARY_DARK = "#144d2f";
const PRIMARY_LIGHT = "#e8f5ee";
const PRIMARY_MID = "#2d7a4f";
const ACCENT = "#f0faf4";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1a1a1a", background: "#fff", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .nav-link { color: #fff; text-decoration: none; font-weight: 500; font-size: 0.93rem; padding: 6px 2px; border-bottom: 2px solid transparent; transition: border-color 0.2s, color 0.2s; }
        .nav-link:hover { border-bottom-color: #a8d5b5; color: #a8d5b5; }
        .nav-link-scrolled { color: #1a5c38 !important; }
        .nav-link-scrolled:hover { border-bottom-color: #1a5c38 !important; color: #1a5c38 !important; }
        .btn-primary { background: ${PRIMARY}; color: #fff; border: none; padding: 14px 32px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; display: inline-block; text-decoration: none; }
        .btn-primary:hover { background: ${PRIMARY_DARK}; transform: translateY(-2px); }
        .btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.7); padding: 12px 28px; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-outline:hover { background: rgba(255,255,255,0.15); border-color: #fff; }
        .feature-card { background: #fff; border-radius: 16px; padding: 28px 24px; box-shadow: 0 4px 20px rgba(26,92,56,0.08); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #e8f5ee; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(26,92,56,0.15); }
        .program-card { border-radius: 20px; padding: 36px 28px; transition: transform 0.2s, box-shadow 0.2s; }
        .program-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(26,92,56,0.15); }
        .faq-item { border-bottom: 1px solid #d4eddf; }
        .faq-btn { width: 100%; background: none; border: none; text-align: left; padding: 20px 0; cursor: pointer; font-size: 1rem; font-weight: 600; color: #1a1a1a; display: flex; justify-content: space-between; align-items: center; font-family: inherit; }
        .faq-btn:hover { color: ${PRIMARY}; }
        section { padding: 80px 20px; }
        .container { max-width: 1100px; margin: 0 auto; }
        .section-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${PRIMARY}; margin-bottom: 12px; }
        .section-title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.2; margin-bottom: 16px; color: #1a1a1a; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .tag { display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        input, textarea { font-family: inherit; }
        @media (max-width: 768px) {
          section { padding: 60px 16px; }
          .desktop-nav { display: none !important; }
          .mobile-btn { display: block !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(26,92,56,0.97)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none",
        backdropFilter: "blur(10px)",
        transition: "background 0.3s, box-shadow 0.3s",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          {/* LOGO */}
          <a href="#beranda" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 42, height: 42,
              background: scrolled ? PRIMARY : "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem", border: scrolled ? "none" : "2px solid rgba(255,255,255,0.5)",
              transition: "all 0.3s"
            }}>📘</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: scrolled ? PRIMARY : "#fff", lineHeight: 1.1, transition: "color 0.3s" }}>PKBM Bina Mandiri</div>
              <div style={{ fontSize: "0.68rem", color: scrolled ? "#666" : "rgba(255,255,255,0.75)", transition: "color 0.3s" }}>Pendidikan Kesetaraan · Sumedang</div>
            </div>
          </a>

          {/* DESKTOP NAV */}
          <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className={`nav-link${scrolled ? " nav-link-scrolled" : ""}`}>{l.label}</a>
            ))}
            <Link to="/daftar" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.9rem", background: scrolled ? PRIMARY : "#fff", color: scrolled ? "#fff" : PRIMARY }}>
              Daftar Sekarang
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: scrolled ? PRIMARY : "#fff" }}
          >☰</button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{ background: "#fff", padding: "16px 24px", borderTop: `3px solid ${PRIMARY}` }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #eee", color: PRIMARY, textDecoration: "none", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <Link to="/daftar" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 12 }} onClick={() => setMenuOpen(false)}>Daftar Sekarang</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="beranda" style={{
        background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 55%, #2d8a56 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 90
      }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} >
          <div className="fade-up">
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "6px 16px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600, marginBottom: 20, letterSpacing: 1 }}>
              🏫 Resmi · Terakreditasi · Kabupaten Sumedang
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
              "Pendidikan Setara,<br />
              <span style={{ color: "#a8d5b5" }}>Masa Depan Gemilang"</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
              Penyelenggara Resmi Program Pendidikan Kesetaraan Paket A, Paket B, dan Paket C di Bawah Naungan Dinas Pendidikan Kabupaten Sumedang.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/daftar" className="btn-primary" style={{ background: "#fff", color: PRIMARY, fontWeight: 700 }}>Daftar Sekarang</Link>
              <a href="#program" className="btn-outline">Lihat Program</a>
            </div>
            <div style={{ display: "flex", gap: 36, marginTop: 48 }}>
              {[["500+", "Alumni"], ["3", "Program"], ["100%", "Resmi"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "#fff" }}>{num}</div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGO BULAT */}
          <div className="hide-mobile" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 320, height: 320,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.25)",
              fontSize: "8rem"
            }}>📗</div>
          </div>
        </div>
      </section>

      {/* PROFIL */}
      <section id="profil" style={{ background: ACCENT }}>
        <div className="container">
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${PRIMARY_LIGHT}, #b7dfc7)`, borderRadius: 24, padding: 52, textAlign: "center", fontSize: "5.5rem" }}>📘</div>
            <div>
              <p className="section-label">Tentang Kami</p>
              <h2 className="section-title">PKBM Bina Mandiri</h2>
              <p style={{ color: "#555", lineHeight: 1.8, marginBottom: 16 }}>
                <strong style={{ color: PRIMARY }}>PKBM Bina Mandiri</strong> adalah lembaga pendidikan nonformal resmi di bawah naungan Dinas Pendidikan Kabupaten Sumedang yang berkomitmen memberikan kesempatan pendidikan setara bagi seluruh lapisan masyarakat.
              </p>
              <p style={{ color: "#555", lineHeight: 1.8, marginBottom: 28 }}>
                Kami menerima pendaftaran warga belajar baru maupun pindahan dari seluruh penjuru Indonesia, dengan sistem pembelajaran yang fleksibel dan biaya terjangkau.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Resmi Kemendikbud", "Terakreditasi", "Bebas Usia", "Bebas Domisili"].map(t => (
                  <span key={t} className="tag" style={{ background: PRIMARY_LIGHT, color: PRIMARY, border: `1px solid #b7dfc7` }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" style={{ background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="section-label">Program Kami</p>
            <h2 className="section-title">Pendidikan Kesetaraan</h2>
            <p style={{ color: "#666", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              Pilih program yang sesuai dengan jenjang pendidikan yang ingin kamu selesaikan.
            </p>
          </div>
          <div className="grid-3">
            {PROGRAMS.map((p, i) => (
              <div key={i} className="program-card" style={{ background: p.bg }}>
                <div style={{ fontSize: "2.8rem", marginBottom: 18 }}>{p.emoji}</div>
                <span className="tag" style={{ background: p.accent, color: "#fff", marginBottom: 14, display: "inline-block" }}>{p.setara}</span>
                <h3 style={{ fontWeight: 800, fontSize: "1.35rem", marginBottom: 12, color: p.accent }}>Kesetaraan {p.title}</h3>
                <p style={{ color: "#555", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: 24 }}>{p.desc}</p>
                <Link to="/daftar" style={{ color: p.accent, fontWeight: 700, textDecoration: "none", fontSize: "0.93rem" }}>
                  Daftar Program →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section id="keunggulan" style={{ background: ACCENT }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="section-label">Keunggulan</p>
            <h2 className="section-title">Kenapa Pilih PKBM Bina Mandiri?</h2>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: 52, height: 52, background: PRIMARY_LIGHT, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1.02rem", marginBottom: 10, color: "#1a1a1a" }}>{f.title}</h3>
                <p style={{ color: "#666", fontSize: "0.91rem", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY_MID})`, padding: "64px 20px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem, 4vw, 2.3rem)", fontWeight: 800, marginBottom: 16 }}>
            Pendaftaran Siswa Baru Dibuka!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 32, fontSize: "1.05rem" }}>
            Jangan tunda lagi, raih ijazah resmi dan wujudkan masa depanmu bersama kami.
          </p>
          <Link to="/daftar" className="btn-primary" style={{ background: "#fff", color: PRIMARY, fontSize: "1rem", fontWeight: 700 }}>
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: "#fff" }}>
        <div className="container" style={{ maxWidth: 740 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="section-label">Tanya Jawab</p>
            <h2 className="section-title">Pertanyaan Umum</h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span style={{ fontSize: "1.4rem", color: PRIMARY, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none", display: "inline-block", minWidth: 24, textAlign: "center" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ paddingBottom: 20, color: "#555", lineHeight: 1.8, fontSize: "0.94rem" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" style={{ background: ACCENT }}>
        <div className="container">
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              <p className="section-label">Hubungi Kami</p>
              <h2 className="section-title">Ada Pertanyaan?</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: 28 }}>
                Tim kami siap membantu kamu menemukan program yang tepat dan proses pendaftaran yang mudah.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  ["📍", "Alamat", "Kabupaten Sumedang, Jawa Barat"],
                  ["📞", "Telepon/WA", "0857-XXXX-XXXX"],
                  ["📧", "Email", "info@pkbm-binamandiri.id"],
                  ["🕐", "Jam Layanan", "Senin–Jumat, 08.00–16.00 WIB"],
                ].map(([icon, label, val]) => (
                  <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, background: PRIMARY_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#888", marginBottom: 2 }}>{label}</div>
                      <div style={{ color: "#1a1a1a", fontWeight: 500 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 4px 24px rgba(26,92,56,0.09)", border: `1px solid ${PRIMARY_LIGHT}` }}>
              <h3 style={{ fontWeight: 700, marginBottom: 24, color: PRIMARY }}>Kirim Pesan</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Nama Lengkap", "No HP/WA", "Email"].map(p => (
                  <input key={p} placeholder={p} style={{ padding: "12px 16px", border: `1.5px solid #d4eddf`, borderRadius: 10, fontSize: "0.94rem", outline: "none", width: "100%", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = PRIMARY}
                    onBlur={e => e.target.style.borderColor = "#d4eddf"} />
                ))}
                <textarea placeholder="Tulis pesan..." rows={4} style={{ padding: "12px 16px", border: `1.5px solid #d4eddf`, borderRadius: 10, fontSize: "0.94rem", outline: "none", resize: "vertical", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = PRIMARY}
                  onBlur={e => e.target.style.borderColor = "#d4eddf"} />
                <button className="btn-primary" style={{ width: "100%", textAlign: "center", padding: "13px" }}>Kirim Pesan</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: PRIMARY_DARK, color: "rgba(255,255,255,0.8)", padding: "48px 20px 24px" }}>
        <div className="container">
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>📘</div>
                <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>PKBM Bina Mandiri</span>
              </div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.75, maxWidth: 300 }}>
                Penyelenggara Resmi Program Pendidikan Kesetaraan Paket A, B, dan C di Kabupaten Sumedang.
              </p>
            </div>
            <div>
              <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: "0.95rem" }}>Program</h4>
              {["Kesetaraan Paket A", "Kesetaraan Paket B", "Kesetaraan Paket C"].map(p => (
                <a key={p} href="#program" style={{ display: "block", color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.88rem", marginBottom: 8 }}
                  onMouseOver={e => e.target.style.color = "#a8d5b5"}
                  onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.65)"}>{p}</a>
              ))}
            </div>
            <div>
              <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: "0.95rem" }}>Navigasi</h4>
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.88rem", marginBottom: 8 }}
                  onMouseOver={e => e.target.style.color = "#a8d5b5"}
                  onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.65)"}>{l.label}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center", fontSize: "0.83rem" }}>
            © 2025 PKBM Bina Mandiri · Kabupaten Sumedang. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
