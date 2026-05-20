const fs = require('fs');
const file = 'frontend/src/pages/siswa/DashboardSiswa.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add ProfileEditorCard import
if (!content.includes('ProfileEditorCard')) {
  content = content.replace(
    /import Sidebar from '..\/..\/components\/Sidebar\.jsx';/,
    "import Sidebar from '../../components/Sidebar.jsx';\nimport ProfileEditorCard from '../../components/ProfileEditorCard.jsx';"
  );
}

// 2. Remove states related to EditDataDiri (lines 35-48 approx)
content = content.replace(
  /const \[editDataDiriOpen[\s\S]*?alamat: '',\s*\}\);/g,
  ''
);

// 3. Remove useEffect and handlers for EditDataDiri (lines 113-171 approx)
content = content.replace(
  /useEffect\(\(\) => \{\s*if \(\!profil\) return;\s*setFormDataDiri[\s\S]*?setSavingDataDiri\(false\);\s*\}\s*\};\s*/g,
  ''
);

// 4. Replace the .profil-card block with ProfileEditorCard
content = content.replace(
  /\{\/\* -- Kartu Profil Singkat -- \*\/\}\s*\{profil && \([\s\S]*?<\/div>\s*\)\}/,
  \{/* -- Kartu Profil Singkat -- */}
          <ProfileEditorCard user={user} onUserUpdate={setUser} onProfileUpdate={setProfil} compact />\
);

// 5. Remove the Data Diri block
content = content.replace(
  /\{\/\* -- Detail Profil Lengkap -- \*\/\}\s*\{profil && \([\s\S]*?<\/div>\s*\)\}\s*\{dataDiriSuccess && \([\s\S]*?<\/div>\s*\)\}\s*\{dataDiriError && \([\s\S]*?<\/div>\s*\)\}/,
  ''
);

// 6. Remove the Modal block
content = content.replace(
  /\{\/\* -- Modal Edit Data Diri -- \*\/\}\s*\{editDataDiriOpen && \([\s\S]*?<\/div>\s*\)\}/,
  ''
);

fs.writeFileSync(file, content);
console.log('Done replacing parts in DashboardSiswa.jsx');
