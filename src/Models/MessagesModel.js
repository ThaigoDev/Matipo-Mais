const db = require("../config/db");

const KINDS = {
  sugestao: "Sugestão",
  correcao: "Correção de informação",
  cadastro: "Pedido de cadastro",
  duvida: "Dúvida",
  suporte: "Suporte",
};

const toEntity = (row) =>
  row && {
    _id: row.id,
    kind: row.kind,
    kindLabel: KINDS[row.kind] || row.kind,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    body: row.body,
    refType: row.ref_type,
    refId: row.ref_id,
    refName: row.ref_name,
    status: row.status,
    createdAt: row.created_at,
  };

class MessagesBR {
  static get KINDS() {
    return KINDS;
  }

  // Valida e salva uma mensagem enviada pelo site público
  static async create(body) {
    const erros = [];
    const name = (body.name || "").trim();
    const text = (body.body || "").trim();
    const kind = KINDS[body.kind] ? body.kind : "sugestao";
    if (name.length < 2) erros.push("Informe seu nome.");
    if (text.length < 10) erros.push("Escreva uma mensagem com pelo menos 10 caracteres.");
    if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) erros.push("Informe um e-mail válido.");
    if (erros.length) return { erros };

    const refId = parseInt(body.refId, 10);
    await db.query(
      `INSERT INTO messages (kind, name, email, phone, subject, body, ref_type, ref_id, ref_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        kind,
        name.slice(0, 120),
        (body.email || "").trim().slice(0, 160) || null,
        (body.phone || "").trim().slice(0, 40) || null,
        (body.subject || "").trim().slice(0, 160) || null,
        text.slice(0, 4000),
        body.refType || null,
        Number.isNaN(refId) ? null : refId,
        (body.refName || "").slice(0, 160) || null,
      ]
    );
    return { erros: [] };
  }

  static async list(status) {
    const { rows } = status
      ? await db.query("SELECT * FROM messages WHERE status = $1 ORDER BY created_at DESC", [status])
      : await db.query("SELECT * FROM messages ORDER BY created_at DESC");
    return rows.map(toEntity);
  }

  static async counts() {
    const { rows } = await db.query("SELECT status, count(*)::int AS total FROM messages GROUP BY status");
    const counts = { novo: 0, lido: 0, resolvido: 0, total: 0 };
    rows.forEach((r) => {
      counts[r.status] = r.total;
      counts.total += r.total;
    });
    return counts;
  }

  static async setStatus(id, status) {
    if (!["novo", "lido", "resolvido"].includes(status)) return null;
    const { rows } = await db.query("UPDATE messages SET status = $2 WHERE id = $1 RETURNING *", [parseInt(id, 10) || 0, status]);
    return toEntity(rows[0]);
  }

  static async remove(id) {
    const { rows } = await db.query("DELETE FROM messages WHERE id = $1 RETURNING *", [parseInt(id, 10) || 0]);
    return toEntity(rows[0]);
  }
}

module.exports = MessagesBR;
