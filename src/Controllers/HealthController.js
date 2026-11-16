const HealthBR = require("../Models/HealthModel");

// Página pública de detalhe (o gerenciamento fica em AdminController)
class HealthController {
  static async view(req, res) {
    const rules = new HealthBR();
    const health = await rules.getById(req.params.id);
    if (!health) return res.redirect("/health/index");
    // Visitas de administradores logados não contam
    if (!req.session.user) await rules.incrementViews(health._id);
    res.render("IndividualPageHealth", { health });
  }
}

module.exports = HealthController;
