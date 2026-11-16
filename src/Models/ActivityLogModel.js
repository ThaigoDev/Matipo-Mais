const db = require("../config/db");

const ACTIONS = {
  create: "criou",
  update: "editou",
  delete: "excluiu",
  duplicate: "duplicou",
  status: "alterou o status de",
  feature: "alterou o destaque de",
  login: "entrou no painel",
  message: "atualizou a mensagem de",
};

class ActivityLog {
  static get ACTIONS() {
    return ACTIONS;
  }

  // Registra uma ação feita no painel (nunca derruba a requisição)
  static async log(user, action, entityType, entityId, entityName) {
    try {
      await db.query(
        `INSERT INTO activity_log (user_id, user_name, action, entity_type, entity_id, entity_name)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user ? user._id : null, user ? user.name : "Sistema", action, entityType, entityId || null, entityName || null]
      );
    } catch (e) {
      console.error("Falha ao registrar atividade:", e.message);
    }
  }

  static async recent(limit = 50, offset = 0) {
    const { rows } = await db.query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
    return rows.map((r) => ({
      _id: r.id,
      userName: r.user_name,
      action: r.action,
      actionLabel: ACTIONS[r.action] || r.action,
      entityType: r.entity_type,
      entityId: r.entity_id,
      entityName: r.entity_name,
      createdAt: r.created_at,
    }));
  }
}

module.exports = ActivityLog;
