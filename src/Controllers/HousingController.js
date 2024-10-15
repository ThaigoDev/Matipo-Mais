const BusinessRules = require("../Models/BusinessModel");
const CategoryRules = require("../Models/CategoryModels");
class HousingController {
  static async index(req, res) {
    const categoryBR = new CategoryRules(req.body);
    const categories = await categoryBR.read();
    const businessBR = new BusinessRules(req.body);
    const allBusiness = await businessBR.read();
    res.render("HousingPage", { categories, allBusiness });
  }
}

module.exports = HousingController;
