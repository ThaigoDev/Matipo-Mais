const crypto = require("crypto");
const db = require("../config/db");

// Senhas guardadas como hash scrypt: "salt:hash" (hex)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected);
}

class LoginAndSignUpBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.account = null;
  }

  // Cria ou atualiza uma conta (usado pelo script seed:admin)
  async create() {
    const { name, email, password } = this.body;
    const { rows } = await db.query(
      `INSERT INTO accounts (name, email, password_hash) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash
       RETURNING id, name, email`,
      [name, email.toLowerCase(), hashPassword(password)]
    );
    this.account = { _id: rows[0].id, name: rows[0].name, email: rows[0].email };
  }

  async auth() {
    const email = (this.body.email || "").trim().toLowerCase();
    const { rows } = await db.query("SELECT * FROM accounts WHERE email = $1", [email]);
    const account = rows[0];

    if (!account) {
      this.erros.push("Usuário não encontrado !");
      return;
    }
    if (!verifyPassword(this.body.password || "", account.password_hash)) {
      this.erros.push("Senha incorreta !");
      return;
    }
    // Nunca guardar o hash da senha na sessão
    this.account = { _id: account.id, name: account.name, email: account.email };
  }

  // ---------- Gestão de administradores ----------
  static validate({ name, email, password }, { requirePassword = true } = {}) {
    const erros = [];
    if (name !== undefined && (name || "").trim().length < 2) erros.push("Informe o nome.");
    if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email || "")) erros.push("Informe um e-mail válido.");
    if (requirePassword && (password || "").length < 8) erros.push("A senha precisa ter pelo menos 8 caracteres.");
    return erros;
  }

  static async list() {
    const { rows } = await db.query("SELECT id, name, email, created_at FROM accounts ORDER BY name");
    return rows.map((r) => ({ _id: r.id, name: r.name, email: r.email, createdAt: r.created_at }));
  }

  static async exists(email) {
    const { rows } = await db.query("SELECT 1 FROM accounts WHERE email = $1", [(email || "").trim().toLowerCase()]);
    return rows.length > 0;
  }

  static async remove(id) {
    const { rows } = await db.query("DELETE FROM accounts WHERE id = $1 RETURNING id, name", [parseInt(id, 10) || 0]);
    // Encerra na hora as sessões abertas dessa pessoa
    if (rows[0]) await db.query("DELETE FROM sessions WHERE sess->'user'->>'_id' = $1", [String(rows[0].id)]);
    return rows[0] || null;
  }

  static async changePassword(id, currentPassword, newPassword) {
    const { rows } = await db.query("SELECT password_hash FROM accounts WHERE id = $1", [id]);
    if (!rows[0] || !verifyPassword(currentPassword || "", rows[0].password_hash)) return ["Senha atual incorreta."];
    const erros = LoginAndSignUpBR.validate({ password: newPassword });
    if (erros.length) return erros;
    await db.query("UPDATE accounts SET password_hash = $2 WHERE id = $1", [id, hashPassword(newPassword)]);
    return [];
  }

  static async updateProfile(id, name) {
    const { rows } = await db.query("UPDATE accounts SET name = $2 WHERE id = $1 RETURNING id, name, email", [id, name.trim()]);
    return rows[0] && { _id: rows[0].id, name: rows[0].name, email: rows[0].email };
  }
}

module.exports = LoginAndSignUpBR;
