const BusinessRules = require("../ Models/BusinessModel");
const CategoryRules = require("../ Models/CategoryModels");
class BusinessController {
  static async create(req, res) {
    try { 
      console.log(req.file)
      let body = {};
      const categoryBR = new CategoryRules(req.body);
      const categoryFinded = await categoryBR.findByCategory(
        req.body.categoryName
      );
      if (!req.file) {
        body = {
          businessName: req.body.businessName,
          businessLocation: req.body.businessLocation,
          businessDescription: req.body.businessDescription,
          businessContact: {
            tel: req.body.tel,
            whatsApp: req.body.whatsApp,
            email: req.body.email,
          },
          openingTime: req.body.openingTime,
          closingTime: req.body.closingTime,
          operatingDays: req.body.operatingDays,
          categoryID: categoryFinded._id,
        };
      } else {
        body = {
          businessPhoto: req.file.filename,
          businessName: req.body.businessName,
          businessLocation: req.body.businessLocation,
          businessDescription: req.body.businessDescription,
          businessContact: {
            tel: req.body.tel,
            whatsApp: req.body.whatsApp,
            email: req.body.email,
          },
          openingTime: req.body.openingTime,
          closingTime: req.body.closingTime,
          operatingDays: req.body.operatingDays,
          categoryID: categoryFinded._id,
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
  static async index(req, res) {
    try {
      const categoryBR = new CategoryRules(req.body);
      const categories = await categoryBR.read();
      const businessBR = new BusinessRules(req.body);
      const allBusiness = await businessBR.read();
      res.render("BusinessPage", { allBusiness, categories });
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
}
module.exports = BusinessController;
