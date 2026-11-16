const { sections, GROUPS, completeness } = require("../config/adminSections");
const CategoryRules = require("../Models/CategoryModels");
const ActivityLog = require("../Models/ActivityLogModel");
const MessagesBR = require("../Models/MessagesModel");

const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const nowInBrazil = () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
const todayISO = () => {
  const d = nowInBrazil();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const normalize = (t) => (t || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Aceita tanto o código <iframe> do Google Maps quanto uma URL
function normalizeMap(value) {
  const text = (value || "").toString().trim();
  const match = text.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : text;
}

function getSection(req, res) {
  const section = sections[req.params.section];
  if (!section) res.redirect("/admin/dashboard");
  return section;
}

// Monta o objeto salvo no banco a partir do formulário
async function buildBody(section, req, mode) {
  const body = { ...req.body };
  delete body.removePhoto;

  if (req.file) body[section.photoField] = req.file.filename;
  else if (req.body.removePhoto === "1") body[section.photoField] = null;

  if (body[section.mapField] !== undefined) body[section.mapField] = normalizeMap(body[section.mapField]);

  const category = await new CategoryRules().findByCategory(body.categoryName);
  body.categoryID = category ? category._id : null;

  if (mode === "create") {
    body.publisher = req.session.user.name;
    body.datePublish = todayISO();
    if (!body.status) body.status = section.statusOptions[0];
  }
  return body;
}

function missingRequired(section, body) {
  return section.fields
    .filter((f) => f.required && f.type !== "category" && !String(body[f.name] ?? "").trim())
    .map((f) => f.label);
}

class AdminController {
  // ---------- Visão geral ----------
  static async dashboard(req, res) {
    const today = WEEKDAYS[nowInBrazil().getDay()];
    const stats = {};
    const incomplete = [];
    const topViewed = [];
    let health = [];

    for (const section of Object.values(sections)) {
      const records = await section.model.repository.findAll();
      if (section.key === "health") health = records;
      stats[section.key] = {
        total: records.length,
        active: records.filter((r) => r.status === section.statusOptions[0]).length,
        featured: records.filter((r) => r.featured).length,
        views: records.reduce((sum, r) => sum + (r.views || 0), 0),
      };
      records.forEach((r) => {
        const c = completeness(section, r);
        if (c.pct < 100) incomplete.push({ section, record: r, ...c });
        topViewed.push({ section, record: r });
      });
    }

    incomplete.sort((a, b) => a.pct - b.pct);
    topViewed.sort((a, b) => (b.record.views || 0) - (a.record.views || 0));

    const dutyWeek = WEEKDAYS.map((day) => ({
      day,
      isToday: day === today,
      places: health.filter((h) => (h.daysOnDuty || []).includes(day)),
    }));

    res.render("admin/dashboard", {
      page: "dashboard",
      stats,
      sections,
      today,
      dutyWeek,
      incomplete: incomplete.slice(0, 6),
      incompleteTotal: incomplete.length,
      topViewed: topViewed.filter((t) => t.record.views > 0).slice(0, 6),
      activity: await ActivityLog.recent(8),
      messages: (await MessagesBR.list("novo")).slice(0, 4),
    });
  }

  // ---------- Busca global ----------
  static async search(req, res) {
    const q = (req.query.q || "").trim();
    const results = [];
    if (q) {
      const needle = normalize(q);
      for (const section of Object.values(sections)) {
        const records = await section.model.repository.findAll();
        records
          .filter((r) => normalize([r[section.nameField], r[section.locationField], r.categoryName, r[section.subtitleField]].join(" ")).includes(needle))
          .forEach((record) => results.push({ section, record }));
      }
    }
    res.render("admin/search", { page: "search", q, results });
  }

  // ---------- Listagem de uma seção ----------
  static async index(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const records = (await section.model.repository.findAll()).map((record) => ({
      record,
      completeness: completeness(section, record),
    }));
    res.render("admin/section", {
      page: section.key,
      section,
      groups: GROUPS,
      records,
      categories: await new CategoryRules().read(),
      openNew: req.query.new === "1",
      openEdit: req.query.edit || null,
    });
  }

  static async create(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const body = await buildBody(section, req, "create");
    const missing = missingRequired(section, body);
    if (missing.length) {
      req.flash("erros", `Preencha os campos obrigatórios: ${missing.join(", ")}.`);
      return res.redirect(`${section.base}/?new=1`);
    }
    const repo = section.model.repository;
    const created = await repo.insert(body);
    await ActivityLog.log(req.session.user, "create", section.key, created._id, created[section.nameField]);
    req.flash("success", `“${created[section.nameField]}” foi publicado.`);
    res.redirect(`${section.base}/`);
  }

  static async update(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const body = await buildBody(section, req, "update");
    const missing = missingRequired(section, body);
    if (missing.length) {
      req.flash("erros", `Preencha os campos obrigatórios: ${missing.join(", ")}.`);
      return res.redirect(`${section.base}/?edit=${req.params.id}`);
    }
    const updated = await section.model.repository.update(req.params.id, body);
    if (!updated) {
      req.flash("erros", "Registro não encontrado.");
      return res.redirect(`${section.base}/`);
    }
    await ActivityLog.log(req.session.user, "update", section.key, updated._id, updated[section.nameField]);
    req.flash("success", `Alterações em “${updated[section.nameField]}” salvas.`);
    res.redirect(`${section.base}/`);
  }

  static async remove(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const removed = await section.model.repository.remove(req.params.id);
    if (removed) {
      await ActivityLog.log(req.session.user, "delete", section.key, removed._id, removed[section.nameField]);
      req.flash("success", `“${removed[section.nameField]}” foi excluído.`);
    }
    res.redirect(`${section.base}/`);
  }

  static async duplicate(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const repo = section.model.repository;
    const original = await repo.findById(req.params.id);
    if (!original) return res.redirect(`${section.base}/`);
    const copy = await repo.insert({
      ...original,
      [section.nameField]: `${original[section.nameField]} (cópia)`,
      featured: false,
      publisher: req.session.user.name,
      datePublish: todayISO(),
    });
    await ActivityLog.log(req.session.user, "duplicate", section.key, copy._id, copy[section.nameField]);
    req.flash("success", "Cópia criada. Revise os dados antes de divulgar.");
    res.redirect(`${section.base}/?edit=${copy._id}`);
  }

  static async toggleStatus(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const repo = section.model.repository;
    const record = await repo.findById(req.params.id);
    if (record) {
      const [first, second] = section.statusOptions;
      const status = record.status === first ? second : first;
      await repo.update(record._id, { status });
      await ActivityLog.log(req.session.user, "status", section.key, record._id, `${record[section.nameField]} → ${status}`);
      req.flash("success", `“${record[section.nameField]}” agora está como ${status}.`);
    }
    res.redirect(`${section.base}/`);
  }

  static async toggleFeatured(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const repo = section.model.repository;
    const record = await repo.findById(req.params.id);
    if (record) {
      await repo.update(record._id, { featured: !record.featured }, { touch: false });
      await ActivityLog.log(req.session.user, "feature", section.key, record._id, record[section.nameField]);
      req.flash("success", record.featured ? "Destaque removido." : `“${record[section.nameField]}” agora aparece em destaque no site.`);
    }
    res.redirect(`${section.base}/`);
  }

  // Ações em massa: excluir, mudar status, destacar
  static async bulk(req, res) {
    const section = getSection(req, res);
    if (!section) return;
    const repo = section.model.repository;
    const ids = [].concat(req.body.ids || []).map((id) => parseInt(id, 10)).filter(Boolean);
    const action = req.body.action || "";
    if (!ids.length) {
      req.flash("erros", "Selecione ao menos um registro.");
      return res.redirect(`${section.base}/`);
    }

    for (const id of ids) {
      if (action === "delete") {
        const removed = await repo.remove(id);
        if (removed) await ActivityLog.log(req.session.user, "delete", section.key, id, removed[section.nameField]);
      } else if (action.startsWith("status:") && section.statusOptions.includes(action.slice(7))) {
        const updated = await repo.update(id, { status: action.slice(7) });
        if (updated) await ActivityLog.log(req.session.user, "status", section.key, id, `${updated[section.nameField]} → ${action.slice(7)}`);
      } else if (action === "feature" || action === "unfeature") {
        const updated = await repo.update(id, { featured: action === "feature" }, { touch: false });
        if (updated) await ActivityLog.log(req.session.user, "feature", section.key, id, updated[section.nameField]);
      }
    }
    req.flash("success", `${ids.length} ${ids.length === 1 ? "registro atualizado" : "registros atualizados"}.`);
    res.redirect(`${section.base}/`);
  }
}

module.exports = AdminController;
