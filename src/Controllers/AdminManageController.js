const db = require("../config/db");
const { sections } = require("../config/adminSections");
const ActivityLog = require("../Models/ActivityLogModel");
const MessagesBR = require("../Models/MessagesModel");
const LoginAndSignUpBR = require("../Models/LoginAndSignUpModel");

const back = (res, url, req, type, text) => {
  req.flash(type, text);
  res.redirect(url);
};

class AdminManageController {
  // ---------- Categorias ----------
  static async categories(req, res) {
    const { rows } = await db.query(`
      SELECT c.id, c.category,
        (SELECT count(*) FROM business b WHERE b.category_id = c.id)::int AS business,
        (SELECT count(*) FROM health h WHERE h.category_id = c.id)::int AS health,
        (SELECT count(*) FROM housing ho WHERE ho.category_id = c.id)::int AS housing,
        (SELECT count(*) FROM jobs j WHERE j.category_id = c.id)::int AS jobs
      FROM categories c ORDER BY c.category`);
    res.render("admin/categories", { page: "categories", categories: rows, sections });
  }

  static async createCategory(req, res) {
    const name = (req.body.category || "").trim();
    if (name.length < 2) return back(res, "/admin/categories", req, "erros", "Informe o nome da categoria.");
    const { rows } = await db.query("INSERT INTO categories (category) VALUES ($1) ON CONFLICT (category) DO NOTHING RETURNING id", [name]);
    if (!rows.length) return back(res, "/admin/categories", req, "erros", `A categoria “${name}” já existe.`);
    await ActivityLog.log(req.session.user, "create", "category", rows[0].id, name);
    back(res, "/admin/categories", req, "success", `Categoria “${name}” criada.`);
  }

  static async renameCategory(req, res) {
    const name = (req.body.category || "").trim();
    const id = parseInt(req.params.id, 10) || 0;
    if (name.length < 2) return back(res, "/admin/categories", req, "erros", "Informe o nome da categoria.");
    try {
      const { rows } = await db.query("UPDATE categories SET category = $2 WHERE id = $1 RETURNING id", [id, name]);
      if (!rows.length) return res.redirect("/admin/categories");
      // Mantém o nome exibido nos cadastros sincronizado
      for (const table of ["business", "health", "housing", "jobs"]) {
        await db.query(`UPDATE ${table} SET category_name = $2 WHERE category_id = $1`, [id, name]);
      }
      await ActivityLog.log(req.session.user, "update", "category", id, name);
      back(res, "/admin/categories", req, "success", "Categoria renomeada.");
    } catch (e) {
      back(res, "/admin/categories", req, "erros", `Já existe uma categoria chamada “${name}”.`);
    }
  }

  static async deleteCategory(req, res) {
    const { rows } = await db.query("DELETE FROM categories WHERE id = $1 RETURNING category", [parseInt(req.params.id, 10) || 0]);
    if (rows.length) {
      await ActivityLog.log(req.session.user, "delete", "category", req.params.id, rows[0].category);
      req.flash("success", `Categoria “${rows[0].category}” excluída. Os cadastros dela continuam publicados.`);
    }
    res.redirect("/admin/categories");
  }

  // ---------- Mensagens dos cidadãos ----------
  static async messages(req, res) {
    const filter = ["novo", "lido", "resolvido"].includes(req.query.status) ? req.query.status : "";
    res.render("admin/messages", {
      page: "messages",
      filter,
      messages: await MessagesBR.list(filter),
      counts: await MessagesBR.counts(),
      sections,
    });
  }

  static async messageStatus(req, res) {
    const message = await MessagesBR.setStatus(req.params.id, req.body.status);
    if (message) {
      await ActivityLog.log(req.session.user, "message", "message", message._id, `${message.name} → ${message.status}`);
      req.flash("success", message.status === "resolvido" ? "Mensagem marcada como resolvida." : "Mensagem atualizada.");
    }
    res.redirect(req.body.redirect === "dashboard" ? "/admin/dashboard" : `/admin/messages${req.query.status ? "?status=" + req.query.status : ""}`);
  }

  static async deleteMessage(req, res) {
    const message = await MessagesBR.remove(req.params.id);
    if (message) {
      await ActivityLog.log(req.session.user, "delete", "message", message._id, message.name);
      req.flash("success", "Mensagem excluída.");
    }
    res.redirect("/admin/messages");
  }

  // ---------- Histórico ----------
  static async activity(req, res) {
    const pageNumber = Math.max(1, parseInt(req.query.p, 10) || 1);
    const perPage = 40;
    const items = await ActivityLog.recent(perPage + 1, (pageNumber - 1) * perPage);
    res.render("admin/activity", {
      page: "activity",
      items: items.slice(0, perPage),
      hasNext: items.length > perPage,
      pageNumber,
      sections,
    });
  }

  // ---------- Administradores ----------
  static async users(req, res) {
    res.render("admin/users", { page: "users", users: await LoginAndSignUpBR.list() });
  }

  static async createUser(req, res) {
    const { name, email, password } = req.body;
    const erros = LoginAndSignUpBR.validate({ name, email, password });
    if (!erros.length && (await LoginAndSignUpBR.exists(email))) erros.push("Já existe um administrador com esse e-mail.");
    if (erros.length) return back(res, "/admin/users", req, "erros", erros.join(" "));
    const account = new LoginAndSignUpBR({ name: name.trim(), email: email.trim(), password });
    await account.create();
    await ActivityLog.log(req.session.user, "create", "account", account.account._id, account.account.name);
    back(res, "/admin/users", req, "success", `${account.account.name} agora tem acesso ao painel.`);
  }

  static async deleteUser(req, res) {
    if (String(req.params.id) === String(req.session.user._id)) {
      return back(res, "/admin/users", req, "erros", "Você não pode remover a sua própria conta.");
    }
    const users = await LoginAndSignUpBR.list();
    if (users.length <= 1) return back(res, "/admin/users", req, "erros", "É preciso manter pelo menos um administrador.");
    const removed = await LoginAndSignUpBR.remove(req.params.id);
    if (removed) {
      await ActivityLog.log(req.session.user, "delete", "account", removed.id, removed.name);
      req.flash("success", `Acesso de ${removed.name} removido.`);
    }
    res.redirect("/admin/users");
  }

  // ---------- Minha conta ----------
  static async account(req, res) {
    res.render("admin/account", { page: "account" });
  }

  static async updateProfile(req, res) {
    const name = (req.body.name || "").trim();
    if (name.length < 2) return back(res, "/admin/account", req, "erros", "Informe seu nome.");
    req.session.user = await LoginAndSignUpBR.updateProfile(req.session.user._id, name);
    back(res, "/admin/account", req, "success", "Perfil atualizado.");
  }

  static async changePassword(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return back(res, "/admin/account", req, "erros", "A confirmação não confere com a nova senha.");
    const erros = await LoginAndSignUpBR.changePassword(req.session.user._id, currentPassword, newPassword);
    if (erros.length) return back(res, "/admin/account", req, "erros", erros.join(" "));
    back(res, "/admin/account", req, "success", "Senha alterada com sucesso.");
  }
}

module.exports = AdminManageController;
