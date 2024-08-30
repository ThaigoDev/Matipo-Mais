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
        body = {...req.body, categoryID: categoryFinded._id,};
      } else {
        body = {...req.body, categoryID: categoryFinded._id, businessPhoto:req.file.filename};
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
  static async update(req,res) {
    try { 
      let body = {};   
      const categoryBR = new CategoryRules(req.body);
      const categoryFinded = await categoryBR.findByCategory(
        req.body.categoryName
      );
      if (!req.file) {
        body = {...req.body, categoryID: categoryFinded._id,};
      } else {
        body = {...req.body, categoryID: categoryFinded._id, businessPhoto:req.file.filename};
      }
      const businessBR = new BusinessRules(body);
      await businessBR.update(req.params.id);  
      res.redirect("back"); 
    }catch(e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
  static async index(req, res) {
    try { 
      if(!req.session.user) {
        res.render("NoPermission"); 
      }
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
