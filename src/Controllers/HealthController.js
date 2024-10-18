const CategoryRules = require("../Models/CategoryModels");
const HousingBR = require("../Models/HousingModel");
const HealthBR= require("../Models/HealthModel"); 
class HealthController {
  static async index(req, res) {
    try { 
        if (!req.session.user) {
            res.render("NoPermission");
          }
      const categoryBR = new CategoryRules(req.body);
      const categories = await categoryBR.read();
      const healthBR = new HealthBR();
      const allHealth =   await healthBR.read();
      res.render("Health", { categories, allHealth });
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
  static async create(req, res) {
    try {
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
          healthPhoto: req.file.filename,
        };
      }
      const healthBR = new HealthBR(body);
      await healthBR.create();
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
          healthPhoto: req.file.filename,
        };
      }
      const healthBR = new HealthBR(body);
      await healthBR.update(req.params.id);
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
        const healthBR = new HealthBR();
        await healthBR.delete(req.params.id);
      res.redirect("back"); 
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  } 
}
module.exports = HealthController;
