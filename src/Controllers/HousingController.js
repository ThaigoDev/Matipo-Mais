const CategoryRules = require("../Models/CategoryModels");
const HousingBR = require("../Models/HousingModel");
class HousingController {
  static async index(req, res) {
    const categoryBR = new CategoryRules(req.body);
    const categories = await categoryBR.read();
    const housingBR = new HousingBR();
    const allHousing = await housingBR.read();
    res.render("HousingPage", { categories, allHousing });
  }
  static async create(req, res) {
    try {
      console.log(req.file);
      console.log(req.body);
      let body = {};
      const categoryBR = new CategoryRules();
      const categoryFinded = await categoryBR.findByCategory(
        req.body.categoryName
      );
      if (!req.file) {
        body = { ...req.body, categoryID: categoryFinded._id };
      } else {
        body = {
          ...req.body,
          categoryID: categoryFinded._id,
          housingPhoto: req.file.filename,
        };
      }
      const housingBR = new HousingBR(body);
      await housingBR.create();
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
 static  async delete(req, res) {
    try { 
      const housingBR = new HousingBR(); 
      await  housingBR.delete(req.params.id); 
      res.redirect("back"); 
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  } 
   static async update(req,res) {
    try {
      let body = {};
      const categoryBR = new CategoryRules(req.body);
      const categoryFinded = await categoryBR.findByCategory(
        req.body.categoryName
      );
      if (!req.file) {
        body = { ...req.body, categoryID: categoryFinded._id };
      } else {
        body = {
          ...req.body,
          categoryID: categoryFinded._id,
          housingPhoto: req.file.filename,
        };
      }
      const housingBR = new HousingBR(body); 
      await  housingBR.update(req.params.id); 
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
   }
}

module.exports = HousingController;
