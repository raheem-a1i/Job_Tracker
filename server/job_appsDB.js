

let Pool;
try {
  ({ Pool } = require('pg'));
} catch (e) {
  Pool = null;
}

if (Pool && process.env.PGHOST) {
  const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  });

  module.exports = pool;
} else {
  console.warn('job_appsDB: PG env vars not found — using in-memory mock DB.');

  let rows = [];
  let idCounter = 1;

  const mockQuery = async (text, params) => {
    const q = String(text).toUpperCase();

    if (q.includes('INSERT INTO COMPANIES')) {
      const cols = ['company_name', 'job_role', 'notes', 'job_salary', 'date_applied', 'app_status'];
      const row = { id: idCounter++ };
      cols.forEach((c, i) => {
        row[c] = params && params[i] !== undefined ? params[i] : null;
      });
      rows.push(row);
      return { rows: [row] };
    }

    if (q.includes('SELECT * FROM COMPANIES WHERE ID')) {
      const id = params && params[0];
      const found = rows.find(r => Number(r.id) === Number(id));
      return { rows: found ? [found] : [] };
    }

    if (q.includes('SELECT * FROM COMPANIES')) {
      return { rows };
    }

    if (q.includes('DELETE FROM COMPANIES WHERE ID')) {
      const id = params && params[0];
      rows = rows.filter(r => Number(r.id) !== Number(id));
      return { rows: [] };
    }

    if (q.startsWith('UPDATE')) {
      const id = params && params[params.length - 1];
      const idx = rows.findIndex(r => Number(r.id) === Number(id));
      if (idx === -1) return { rows: [] };

  const cols = ['company_name','job_role','date_applied','app_status','status_rejected','status_interviewed','status_offer','notes','job_salary'];
      cols.forEach((c, i) => {
        if (params[i] !== undefined) rows[idx][c] = params[i];
      });
      return { rows: [rows[idx]] };
    }

    return { rows: [] };
  };

  module.exports = { query: mockQuery };
}
