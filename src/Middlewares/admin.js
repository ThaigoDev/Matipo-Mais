const db = require("../config/db");
const { sections } = require("../config/adminSections");

// Bloqueia qualquer rota do painel para quem não está logado
function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user._id) return next();
  if (req.method === "GET") return res.status(403).render("NoPermission");
  req.flash("erros", "Sua sessão expirou. Entre novamente.");
  return res.redirect("/admin/");
}

// Contadores exibidos no menu lateral do painel
async function adminLocals(req, res, next) {
  try {
    const { rows } = await db.query(`
      SELECT
        (SELECT count(*) FROM business)::int AS business,
        (SELECT count(*) FROM health)::int AS health,
        (SELECT count(*) FROM housing)::int AS housing,
        (SELECT count(*) FROM jobs)::int AS jobs,
        (SELECT count(*) FROM messages WHERE status = 'novo')::int AS messages`);
    res.locals.navCounts = rows[0];
  } catch (e) {
    res.locals.navCounts = {};
  }
  res.locals.sections = sections;
  res.locals.page = "";
  next();
}

// Encaminha erros de handlers async para o Express (evita derrubar o servidor)
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { requireAdmin, adminLocals, asyncHandler };
