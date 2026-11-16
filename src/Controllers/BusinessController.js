const BusinessRules = require("../Models/BusinessModel");

// Página pública de detalhe (o gerenciamento fica em AdminController)
class BusinessController {
  static async view(req, res) {
    const rules = new BusinessRules();
    const business = await rules.getById(req.params.id);
    if (!business) return res.redirect("/business/index");
    // Visitas de administradores logados não contam
    if (!req.session.user) await rules.incrementViews(business._id);
    res.render("IndividualPageBusiness", { business });
  }
}

module.exports = BusinessController;
