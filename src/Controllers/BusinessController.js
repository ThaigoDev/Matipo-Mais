const BusinessRules = require("../Models/BusinessModel");
const CategoryRules = require("../Models/CategoryModels");
const nodeCron = require("node-cron");
class BusinessController {
  static async create(req, res) {
    try {
      console.log(req.file);
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
          businessPhoto: req.file.filename,
        };
      }

      const businessBR = new BusinessRules(body);
      await businessBR.create();
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
  static async delete(req, res) {
    try {
      const businessBR = new BusinessRules(req.body);
      await businessBR.delete(req.params.id);
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
  static async update(req, res) {
    try {
      console.log(req.body);

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
          businessPhoto: req.file.filename,
        };
      }
      const businessBR = new BusinessRules(body);
      await businessBR.update(req.params.id);
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
  static async index(req, res) {
    try {
      if (!req.session.user) {
        res.render("NoPermission");
      }

      const categoryBR = new CategoryRules(req.body);
      const categories = await categoryBR.read();
      const businessBR = new BusinessRules(req.body);
      const allBusiness = await businessBR.read();
      nodeCron.schedule("0 19 * * *", async () => {
        try {
          await businessBR.updateStatus("Fechado");
        } catch (e) {
          throw new Error(e);
        }
      });
      nodeCron.schedule("0 6 * * *", async () => {
        try {
          await businessBR.updateStatus("Teste");
        } catch (e) {
          throw new Error(e);
        }
      });
      res.render("BusinessPage", { allBusiness, categories });
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
  static async view(req, res) {
    const businessBR = new BusinessRules(req.body);
    const business = await businessBR.getById(req.params.id);
    res.render("IndividualPageBusiness", { business });
  } 
 
}
module.exports = BusinessController;
