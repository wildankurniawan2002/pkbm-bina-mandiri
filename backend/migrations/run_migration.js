import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    console.log('Running migration...');
    const sql = fs.readFileSync(path.join(__dirname, 'add_rps_file_to_rombel_mapel.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migration completed successfully!');
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME') {
      console.log('Column rps_file_path already exists. Migration skipped.');
    } else {
      console.error('Migration failed:', err);
    }
  } finally {
    process.exit(0);
  }
}

run();
