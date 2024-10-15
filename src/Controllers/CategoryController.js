const CategoryRules = require("../Models/CategoryModels");

class CategoryController {
  static async create(req, res) {
    try {
      const categoryBR = new CategoryRules(req.body);
      await categoryBR.create();
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        status: "failed",
        error: console.error(e),
      });
    }
  }
}
module.exports = CategoryController;
