const fs = require('fs');
let text = fs.readFileSync('frontend/src/pages/siswa/DashboardSiswa.jsx', 'utf8');

// 1. Remove ProfileEditorCard component and fix .profil-card
text = text.replace(
  /<ProfileEditorCard[\s\S]*?onProfileUpdate=\{\(nextProfile\) => setProfil\(nextProfile\)\}\n\s*\/>/g,
  ''
);

// 2. Add toAssetUrl helper at the bottom
const assetUrlHelper = \
function toAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', '');
  return \\\\\\\\\;
}
\;
if (!text.includes('function toAssetUrl')) {
  text = text.replace('export default DashboardSiswa;', assetUrlHelper + '\nexport default DashboardSiswa;');
}

// 3. Update the .profil-card to include photo and Edit Foto button
text = text.replace(
  /<div className="profil-avatar">\s*\{profil\.nama_lengkap\?\.charAt\(0\)\?\.toUpperCase\(\)\}\s*<\/div>\s*<div className="profil-info">\s*<h2 className="profil-nama">\{profil\.nama_lengkap\}<\/h2>/,
  \<div className="profil-avatar" style={{ backgroundImage: profil.foto_profil ? \\\url(\)\\\ : 'none', backgroundSize: 'cover', backgroundPosition: 'center', color: profil.foto_profil ? 'transparent' : 'white' }}>
                {!profil.foto_profil && profil.nama_lengkap?.charAt(0)?.toUpperCase()}
              </div>
              <div className="profil-info">
                <div className="profil-header-top">
                  <h2 className="profil-nama">{profil.nama_lengkap}</h2>
                  <button
                    type="button"
                    className="profil-edit-btn"
                    onClick={() => {
                      setFotoError('');
                      setFotoSuccess('');
                      setEditFotoOpen(true);
                    }}
                  >
                    <i className="bi bi-camera"></i>
                    <span>Edit Profil</span>
                  </button>
                </div>\
);

// 4. Inject EditFotoModal before the closing </div> of DashboardSiswa
const fotoModalInject = \
      {editFotoOpen && (
        <FotoProfilModal
          error={fotoError}
          success={fotoSuccess}
          saving={savingFoto}
          onClose={() => setEditFotoOpen(false)}
          onSelect={handleSelectFoto}
          onSave={handleSaveFoto}
          pendingFoto={pendingFoto}
          currentFoto={profil?.foto_profil ? toAssetUrl(profil.foto_profil) : null}
        />
      )}
    </div>
  );
}\;

text = text.replace(
  /      \{editDataDiriOpen && \([\s\S]*?<\/div>\s*\);\s*\}/,
  (match) => match.replace('    </div>\\n  );\\n}', fotoModalInject)
);

// 5. Append FotoProfilModal definition
const fotoModalDef = \
function FotoProfilModal({ error, success, saving, onClose, onSelect, onSave, pendingFoto, currentFoto }) {
  return (
    <div
      className="app-modal-backdrop"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="app-modal-panel"
        style={{
          width: '100%', maxWidth: 400, background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)', overflow: 'hidden'
        }}
      >
        <div className="mobile-modal-header" style={{ borderBottom: '1px solid var(--color-border)', padding: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="bi bi-camera"></i> Edit Foto Profil
          </h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="mobile-modal-body" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%', backgroundColor: 'var(--color-bg-alt)',
              backgroundImage: pendingFoto ? \\\url(\)\\\ : (currentFoto ? \\\url(\)\\\ : 'none'),
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '3px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {!pendingFoto && !currentFoto && <i className="bi bi-person text-gray-400" style={{ fontSize: '3rem' }}></i>}
            </div>
            
            <label style={{
              position: 'absolute', bottom: 0, right: 0, background: 'var(--color-primary)', color: 'white',
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <i className="bi bi-pencil-fill" style={{ fontSize: '0.85rem' }}></i>
              <input type="file" accept="image/jpeg,image/png,image/jpg" style={{ display: 'none' }} onChange={onSelect} />
            </label>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Pilih foto dengan format JPG, JPEG, atau PNG. Ukuran maksimal disarankan 2MB.
          </p>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', fontSize: '0.875rem' }}>
              <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1rem', padding: '0.75rem', fontSize: '0.875rem' }}>
              <i className="bi bi-check-circle-fill"></i> {success}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Batal</button>
            <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving || !pendingFoto} style={{ flex: 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan Foto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
\;

if (!text.includes('function FotoProfilModal')) {
  text = text.replace('export default DashboardSiswa;', fotoModalDef + '\nexport default DashboardSiswa;');
}

fs.writeFileSync('frontend/src/pages/siswa/DashboardSiswa.jsx', text);
console.log('Done photo modal injection');
