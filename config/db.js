const { Pool } = require('pg');
require('dotenv').config();

const NEON_DB_URL = process.env.NEON_DB_URL;

if (!NEON_DB_URL) {
  console.error('❌ NEON_DB_URL not set in environment variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: NEON_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✓ Connected to Neon (PostgreSQL) database.');

    // Initialize tables
    await initializeTables(client);

    client.release();
    return pool;
  } catch (error) {
    console.error(`❌ Neon DB Connection Error: ${error.message}`);
    throw error;
  }
};

const initializeTables = async (client) => {
  // 1. Separate table for Category Results
  const createCategoryTable = `
    CREATE TABLE IF NOT EXISTS ai_category_reports (
      id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      subcategory VARCHAR(100),
      tags TEXT[],
      sustainability_filters TEXT[],
      raw_ai_response JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. Separate table for Impact Results
  const createImpactTable = `
    CREATE TABLE IF NOT EXISTS ai_impact_reports (
      id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      quantity INTEGER,
      plastic_saved_grams NUMERIC,
      carbon_avoided_kg NUMERIC,
      local_sourcing TEXT,
      impact_statement TEXT,
      raw_ai_response JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 3. Centralized AI interaction logs (Prompt + Response)
  const createAiLogsTable = `
    CREATE TABLE IF NOT EXISTS ai_interaction_logs (
      id SERIAL PRIMARY KEY,
      module_name VARCHAR(100),
      prompt_content TEXT,
      response_content JSONB,
      processing_time_ms INTEGER,
      success BOOLEAN,
      error_message TEXT,
      model_used VARCHAR(50),
      retry_count INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await client.query(createCategoryTable);
  await client.query(createImpactTable);
  await client.query(createAiLogsTable);
  console.log('✓ Project-specific database tables initialized.');
};

module.exports = {
  connectDB,
  pool,
};
