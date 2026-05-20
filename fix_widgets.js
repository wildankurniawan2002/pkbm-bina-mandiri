const fs = require('fs');
const file = 'frontend/src/pages/siswa/KelasTerpaduSiswa.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Center column wrapper
content = content.replace(
  /{loadingDetail \? \(/g,
  '<div style={{ background: \'white\', borderRadius: \'24px\', padding: \'1.5rem\', border: \'1px solid #E2E8F0\', boxShadow: \'0 4px 6px -1px rgba(0,0,0,0.02)\' }}>\n                  {loadingDetail ? ('
);

// Close the wrapper
content = content.replace(
  /\{\/\* 3\. SIDEBAR KANAN: WIDGET PENDUKUNG \*\/\}/g,
  '</div>\n\n                {/* 3. SIDEBAR KANAN: WIDGET PENDUKUNG */}'
);

// 2. Remove backgrounds and shadows from widgets
const regex = /background:\s*'white',\s*borderRadius:\s*'20px',\s*padding:\s*'([^']+)',\s*border:\s*'1px solid #E2E8F0',\s*boxShadow:\s*'0 4px 6px -1px rgba\(0,0,0,0\.02\)'/g;
content = content.replace(regex, (match, p1) => {
  return "background: 'white',\n                        borderRadius: '12px',\n                        padding: '" + p1 + "',\n                        border: '1px solid #E2E8F0'";
});

fs.writeFileSync(file, content);
console.log('Done');
