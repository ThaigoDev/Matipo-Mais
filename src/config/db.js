const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Conexão com o PostgreSQL (definida em DATABASE_URL no arquivo .env)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (e) => console.error("Erro inesperado no PostgreSQL:", e.message));

// Cria as tabelas se ainda não existirem
async function migrate() {
  const schema = fs.readFileSync(path.resolve(__dirname, "..", "..", "db", "schema.sql"), "utf8");
  await pool.query(schema);
}

module.exports = { pool, query: (text, params) => pool.query(text, params), migrate };
