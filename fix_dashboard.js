const fs = require("fs");
let text = fs.readFileSync("frontend/src/pages/siswa/DashboardSiswa.jsx", "utf8");

text = text.replace(
  "import Sidebar from \"../../components/Sidebar.jsx\";",
  "import Sidebar from \"../../components/Sidebar.jsx\";\nimport ProfileEditorCard from \"../../components/ProfileEditorCard.jsx\";"
);

text = text.replace(
  /  const \[editDataDiriOpen[\s\S]*?alamat: \x27\x27,\n  \}\);\n/,
  ""
);

text = text.replace(
  /  useEffect\(\(\) => \{\n    if \(!profil\) return;\n    setFormDataDiri\([\s\S]*?setSavingDataDiri\(false\);\n    \}\n  \};\n/,
  ""
);

text = text.replace(
  /          \{\/\* -- Kartu Profil Singkat -- \*\/\}\n          \{profil && \([\s\S]*?            <\/div>\n          \)\}\n/,
  "          {/* -- Kartu Profil Singkat -- */}\n          <ProfileEditorCard user={user} onUserUpdate={setUser} onProfileUpdate={setProfil} compact />\n"
);

text = text.replace(
  /          \{\/\* -- Detail Profil Lengkap -- \*\/\}\n          \{profil && \([\s\S]*?            <\/div>\n          \)\}\n\n          \{dataDiriSuccess && \([\s\S]*?            <\/div>\n          \)\}\n\n/,
  ""
);

text = text.replace(
  /      \{\/\* -- Modal Edit Data Diri -- \*\/\}\n      \{editDataDiriOpen && \([\s\S]*?\)\n    <\/div>\n  \);\n\}\n\n\/\/ -- Komponen Modal: Edit Data Diri Siswa ---------------------\nfunction EditDataDiriSiswaModal[\s\S]*?\}\n\n\/\/ -- Komponen Kecil: Item Detail Profil -----------------------\nfunction DetailItem[\s\S]*?\}\n/,
  "    </div>\n  );\n}\n"
);

fs.writeFileSync("frontend/src/pages/siswa/DashboardSiswa.jsx", text);
console.log("Done");
