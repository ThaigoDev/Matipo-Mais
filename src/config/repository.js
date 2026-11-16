const db = require("./db");

// Converte o "id" do Postgres para o "_id" usado pelas views e um
// conjunto de campos (camelCase nos formulários -> snake_case no banco).
//
// Tipos aceitos em cada campo: "text" | "int" | "json" | "array" | "bool".
// options.listing = true para tabelas com destaque, visualizações e updated_at.
function createRepository(table, fields, options = {}) {
  const entries = Object.entries(fields);
  const listing = Boolean(options.listing);
  const orderBy = listing ? "featured DESC, id DESC" : "id DESC";

  const toValue = (type, value) => {
    if (type === "int") {
      const n = parseInt(value, 10);
      return Number.isNaN(n) ? null : n;
    }
    if (type === "bool") {
      const last = Array.isArray(value) ? value[value.length - 1] : value;
      return last === true || last === "true" || last === "on" || last === "1";
    }
    if (type === "json") return JSON.stringify(value && typeof value === "object" ? value : {});
    if (type === "array") {
      if (value === undefined || value === null || value === "") return [];
      return (Array.isArray(value) ? value : [value]).filter((v) => v !== "");
    }
    return value === undefined || value === null ? null : String(value);
  };

  const toEntity = (row) => {
    if (!row) return null;
    const entity = { _id: row.id, createdAt: row.created_at };
    if (listing) {
      entity.featured = row.featured;
      entity.views = row.views;
      entity.updatedAt = row.updated_at;
    }
    entries.forEach(([key, { col }]) => (entity[key] = row[col]));
    return entity;
  };

  // Só os campos presentes no body (igual ao comportamento do Mongoose)
  const pick = (body) => {
    const cols = entries
      .filter(([key]) => body[key] !== undefined)
      .map(([key, { col, type }]) => [col, toValue(type, body[key])]);
    if (listing && body.featured !== undefined) cols.push(["featured", toValue("bool", body.featured)]);
    return cols;
  };

  const parseId = (id) => {
    const n = parseInt(id, 10);
    return Number.isNaN(n) ? null : n;
  };

  return {
    table,
    toEntity,

    async insert(body) {
      const cols = pick(body);
      const sql = `INSERT INTO ${table} (${cols.map(([c]) => c).join(", ")})
                   VALUES (${cols.map((_, i) => "$" + (i + 1)).join(", ")}) RETURNING *`;
      const { rows } = await db.query(sql, cols.map(([, v]) => v));
      return toEntity(rows[0]);
    },

    async findAll() {
      const { rows } = await db.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
      return rows.map(toEntity);
    },

    async findById(id) {
      if (parseId(id) === null) return null;
      const { rows } = await db.query(`SELECT * FROM ${table} WHERE id = $1`, [parseId(id)]);
      return toEntity(rows[0]);
    },

    async findOne(key, value) {
      const { rows } = await db.query(`SELECT * FROM ${table} WHERE ${fields[key].col} = $1 LIMIT 1`, [value]);
      return toEntity(rows[0]);
    },

    async update(id, body, { touch = true } = {}) {
      const cols = pick(body);
      if (!cols.length || parseId(id) === null) return null;
      const sets = cols.map(([c], i) => `${c} = $${i + 2}`);
      if (listing && touch) sets.push("updated_at = now()");
      const sql = `UPDATE ${table} SET ${sets.join(", ")} WHERE id = $1 RETURNING *`;
      const { rows } = await db.query(sql, [parseId(id), ...cols.map(([, v]) => v)]);
      return toEntity(rows[0]);
    },

    async remove(id) {
      if (parseId(id) === null) return null;
      const { rows } = await db.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [parseId(id)]);
      return toEntity(rows[0]);
    },

    async incrementViews(id) {
      if (!listing || parseId(id) === null) return;
      await db.query(`UPDATE ${table} SET views = views + 1 WHERE id = $1`, [parseId(id)]);
    },
  };
}

module.exports = createRepository;
