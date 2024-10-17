const CategoryRules = require("../Models/CategoryModels");
const JobsBR = require("../Models/JobsModel");
class JobsController {
  static async index(req, res) {
    try {
      const categoryBR = new CategoryRules(req.body);
      const categories = await categoryBR.read();
      const jobsBR = new JobsBR();
      const allJobs = await jobsBR.read();
      res.render("JobsPage", { allJobs, categories });
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
          jobPhoto: req.file.filename,
        };
      }
      const jobBR = new JobsBR(body);
      await jobBR.create();
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
      const jobBR = new JobsBR();
      await jobBR.delete(req.params.id);
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
    console.log(req.body)
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
          jobPhoto: req.file.filename,
        };
      }
      const jobBR = new JobsBR(body);  
      await jobBR.update(req.params.id); 
      res.redirect("back");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
   }
}

module.exports = JobsController;
