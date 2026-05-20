import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import { UjianAPI } from '../../services/api.js';

function PesertaUjianAdmin() {
  const user = JSON.parse(localStorage.getItem('pkbm_user') || '{}');
  const [periodeList, setPeriodeList] = useState([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState('');
  const [pesertaList, setPesertaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailPeserta, setDetailPeserta] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterPembayaran, setFilterPembayaran] = useState('');
  const [filterKelayakan, setFilterKelayakan] = useState('');

  const loadPeriode = async () => {
    try {
      const res = await UjianAPI.getAllPeriode();
      const data = res.data.data || [];
      setPeriodeList(data);
      if (!selectedPeriodeId && data.length > 0) {
        const active = data.find((item) => Number(item.is_active) === 1);
        setSelectedPeriodeId(String((active || data[0]).id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat periode ujian.');
    }
  };

  const loadPeserta = async (periodeId) => {
    if (!periodeId) {
      setPesertaList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await UjianAPI.getPesertaUjian({
        periode_ujian_id: periodeId,
        status_pembayaran: filterPembayaran || undefined,
        status_kelayakan: filterKelayakan || undefined,
      });
      setPesertaList(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat peserta ujian.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeriode();
  }, []);

  useEffect(() => {
    loadPeserta(selectedPeriodeId);
  }, [selectedPeriodeId, filterPembayaran, filterKelayakan]);

  const handleGenerate = async () => {
    if (!selectedPeriodeId) return;
    try {
      const res = await UjianAPI.generatePesertaUjian({ periode_ujian_id: parseInt(selectedPeriodeId) });
      alert(res.data.message || 'Peserta ujian berhasil didaftarkan.');
      await loadPeserta(selectedPeriodeId);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mendaftarkan peserta ujian.');
    }
  };

  const handleVerifyPembayaran = async (item, status_pembayaran) => {
    try {
      await UjianAPI.verifyPembayaranUjian(item.id, { status_pembayaran });
      await loadPeserta(selectedPeriodeId);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui status pembayaran.');
    }
  };

  const handleKelayakan = async (item, status_kelayakan) => {
    try {
      await UjianAPI.updateKelayakanUjian(item.id, { status_kelayakan });
      await loadPeserta(selectedPeriodeId);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui status kelayakan.');
    }
  };

  const handleGenerateKartu = async (item) => {
    try {
      const res = await UjianAPI.generateKartuUjian(item.id);
      const fileUrl = res.data?.data?.kartu_ujian_url;
      await loadPeserta(selectedPeriodeId);
      if (detailPeserta && detailPeserta.id === item.id) {
        await openDetail(item.id);
      }
      if (fileUrl) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuat kartu ujian.');
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await UjianAPI.getPesertaUjianById(id);
      setDetailPeserta(res.data.data || null);
      setDetailOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memuat detail peserta ujian.');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <main className="app-main">
        <div className="app-content">
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Verifikasi Peserta Ujian</h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
                Verifikasi pembayaran ujian, tetapkan kelayakan, dan pantau peserta per periode ujian.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={!selectedPeriodeId}>
              <i className="bi bi-magic"></i> Daftarkan Peserta Ujian
            </button>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 className="card-title">Filter Peserta Ujian</h3>
              <select className="form-input" value={selectedPeriodeId} onChange={(e) => setSelectedPeriodeId(e.target.value)} style={{ width: 280, height: 38 }}>
                <option value="">Pilih Periode</option>
                {periodeList.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama_periode}</option>
                ))}
              </select>
              <select className="form-input" value={filterPembayaran} onChange={(e) => setFilterPembayaran(e.target.value)} style={{ width: 220, height: 38 }}>
                <option value="">Semua Pembayaran</option>
                <option value="belum_bayar">Belum Bayar</option>
                <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                <option value="ditolak">Ditolak</option>
                <option value="lunas">Lunas</option>
              </select>
              <select className="form-input" value={filterKelayakan} onChange={(e) => setFilterKelayakan(e.target.value)} style={{ width: 180, height: 38 }}>
                <option value="">Semua Kelayakan</option>
                <option value="belum_layak">Belum Layak</option>
                <option value="layak">Layak</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Daftar Peserta Ujian</h3>
            </div>

            {loading ? (
              <div className="loading-container" style={{ padding: '3rem' }}>
                <div className="spinner"></div>
                <p>Memuat peserta ujian...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" style={{ margin: '1.5rem' }}>
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            ) : pesertaList.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-people"></i>
                <h3>Belum Ada Peserta Ujian</h3>
                <p>Daftarkan peserta ujian dari periode yang dipilih untuk mulai verifikasi.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>NIS</th>
                      <th>Nama</th>
                      <th>Rombel</th>
                      <th>Pembayaran</th>
                      <th>Kelayakan</th>
                      <th>Verifikator</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pesertaList.map((item) => (
                      <tr key={item.id}>
                        <td><code>{item.nis}</code></td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{item.nama_lengkap}</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.email}</div>
                        </td>
                        <td>{item.nama_rombel}</td>
                        <td><span className={`badge ${badgeByPembayaran(item.status_pembayaran)}`}>{formatStatus(item.status_pembayaran)}</span></td>
                        <td><span className={`badge ${item.status_kelayakan === 'layak' ? 'badge-success' : 'badge-warning'}`}>{formatStatus(item.status_kelayakan)}</span></td>
                        <td>{item.nama_verifikator || <span style={{ color: 'var(--color-text-muted)' }}>Belum ada</span>}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => openDetail(item.id)}>
                              <i className="bi bi-eye"></i> Detail
                            </button>
                            <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleVerifyPembayaran(item, 'lunas')}>
                              <i className="bi bi-check2-circle"></i> Lunas
                            </button>
                            <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleVerifyPembayaran(item, 'ditolak')}>
                              <i className="bi bi-x-circle"></i> Tolak
                            </button>
                            <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'var(--color-success)', color: 'white' }} onClick={() => handleKelayakan(item, 'layak')}>
                              <i className="bi bi-patch-check"></i> Layak
                            </button>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                              onClick={() => handleGenerateKartu(item)}
                              disabled={item.status_pembayaran !== 'lunas' || item.status_kelayakan !== 'layak'}
                              title={item.status_pembayaran !== 'lunas' || item.status_kelayakan !== 'layak' ? 'Peserta harus lunas dan layak terlebih dahulu' : 'Buat kartu ujian PDF'}
                            >
                              <i className="bi bi-file-earmark-pdf"></i> {item.kartu_ujian_url ? 'Buat Ulang Kartu' : 'Buat Kartu'}
                            </button>
                            {item.kartu_ujian_url && (
                              <a
                                className="btn btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                href={item.kartu_ujian_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-download"></i> Lihat Kartu
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {detailOpen && detailPeserta && (
        <SimpleModal title="Detail Peserta Ujian" onClose={() => setDetailOpen(false)} maxWidth={760}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Info label="Nama" value={detailPeserta.nama_lengkap} />
            <Info label="NIS" value={detailPeserta.nis} />
            <Info label="Rombel" value={detailPeserta.nama_rombel} />
            <Info label="Periode" value={detailPeserta.nama_periode} />
            <Info label="Pembayaran" value={formatStatus(detailPeserta.status_pembayaran)} />
            <Info label="Kelayakan" value={formatStatus(detailPeserta.status_kelayakan)} />
          </div>
          {detailPeserta.kartu_ujian_url && (
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <a className="btn btn-primary" href={detailPeserta.kartu_ujian_url} target="_blank" rel="noopener noreferrer">
                <i className="bi bi-file-earmark-pdf"></i> Lihat Kartu Ujian
              </a>
            </div>
          )}
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--color-border)' }}>
            <div className="card-header">
              <h3 className="card-title">Mapel Ujian Peserta</h3>
            </div>
            {detailPeserta.mapel?.length ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Mapel</th>
                      <th>Paket Ujian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailPeserta.mapel.map((item) => (
                      <tr key={item.id}>
                        <td><code>{item.kode_mapel}</code></td>
                        <td>{item.nama_mapel}</td>
                        <td>{item.judul_paket_ujian}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <i className="bi bi-journal-x"></i>
                <h3>Belum Ada Mapel Ujian</h3>
                <p>Peserta ini belum memiliki daftar mapel ujian.</p>
              </div>
            )}
          </div>
        </SimpleModal>
      )}
    </div>
  );
}

function badgeByPembayaran(status) {
  const map = {
    belum_bayar: 'badge-warning',
    menunggu_verifikasi: 'badge-info',
    ditolak: 'badge-danger',
    lunas: 'badge-success',
  };
  return map[status] || 'badge-neutral';
}

function formatStatus(value) {
  return String(value || '-').replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function Info({ label, value }) {
  return (
    <div style={{ padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value || '-'}</div>
    </div>
  );
}

function SimpleModal({ title, onClose, children, maxWidth = 640 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.15rem', color: 'var(--color-text-muted)' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

export default PesertaUjianAdmin;
