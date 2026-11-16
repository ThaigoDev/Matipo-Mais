const HousingBR = require("../Models/HousingModel");

// Página pública de detalhe (o gerenciamento fica em AdminController)
class HousingController {
  static async view(req, res) {
    const rules = new HousingBR();
    const housing = await rules.getById(req.params.id);
    if (!housing) return res.redirect("/housing/index");
    // Visitas de administradores logados não contam
    if (!req.session.user) await rules.incrementViews(housing._id);
    res.render("IndividualPageHousing", { housing });
  }
}

module.exports = HousingController;
