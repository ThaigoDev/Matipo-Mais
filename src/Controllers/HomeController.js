const BusinessRules = require("../Models/BusinessModel");
const CategoryRules = require("../Models/CategoryModels");
class HomeController {
  static async index(req, res) {
    const categoryBR = new CategoryRules(req.body);
    const categories = await categoryBR.read();
    const businessBR = new BusinessRules(req.body);
    const allBusiness = await businessBR.read();
    res.render("Home", { allBusiness, categories }); //vamos renderizar a página Home, quando a rota "/" for acessada.
  }
}

module.exports = HomeController;
