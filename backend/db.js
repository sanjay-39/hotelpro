const { Pool, Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hotel_booking',
};

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : dbConfig;

const pool = new Pool(poolConfig);


async function ensureDatabaseExists() {
  if (process.env.DATABASE_URL) return;

  const targetDb = dbConfig.database;
  if (!targetDb || targetDb === 'postgres') return;

  const maintenanceClient = new Client({
    ...dbConfig,
    database: 'postgres',
  });

  try {
    await maintenanceClient.connect();
    const checkRes = await maintenanceClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb]
    );

    if (checkRes.rowCount === 0) {
      console.log(`[Database] Database "${targetDb}" does not exist. Creating...`);
      
      await maintenanceClient.query(`CREATE DATABASE "${targetDb.replace(/"/g, '""')}"`);
      console.log(`[Database] Database "${targetDb}" created successfully.`);
    }
  } catch (err) {
    
    if (err.code === '28P01') {
      console.error('\n⚠️  [PostgreSQL Auth Error]: Password authentication failed for user "' + dbConfig.user + '".');
      console.error('👉 Please update DB_PASSWORD in backend/.env with your PostgreSQL password.\n');
    } else {
      console.warn('[Database] Note during DB check:', err.message);
    }
  } finally {
    try {
      await maintenanceClient.end();
    } catch (_) {}
  }
}


async function initDB() {
  try {
    await ensureDatabaseExists();

    const client = await pool.connect();
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS hotels (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          description TEXT,
          price NUMERIC(10, 2) NOT NULL,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          image TEXT,
          images TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await client.query(createTableQuery);

    
      console.log('✅ [Database] PostgreSQL connected and schema verified.');
    } finally {
      client.release();
    }
  } catch (err) {
    if (err.code === '28P01') {
      console.error('\n⚠️  [PostgreSQL Auth Error]: Password authentication failed for user "' + (process.env.DB_USER || 'postgres') + '".');
      console.error('👉 Please configure your password in backend/.env:');
      console.error('   DB_PASSWORD=your_actual_postgres_password\n');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n⚠️  [PostgreSQL Connection Error]: Connection refused on ' + (process.env.DB_HOST || 'localhost') + ':' + (process.env.DB_PORT || 5432));
      console.error('👉 Make sure the PostgreSQL service is running.\n');
    } else {
      console.error('❌ [Database] Connection error:', err.message);
    }
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};
