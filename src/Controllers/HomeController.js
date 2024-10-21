const BusinessRules = require("../Models/BusinessModel");
const CategoryRules = require("../Models/CategoryModels"); 
const JobsBR = require("../Models/JobsModel");
class HomeController {
  static async index(req, res) {
    const categoryBR = new CategoryRules(req.body);
    const categories = await categoryBR.read(); 
    const jobsBR = new JobsBR();
    const allJobs = await jobsBR.read();
    const businessBR = new BusinessRules(req.body);
    const allBusiness = await businessBR.read();
    res.render("Home", { allBusiness, categories,allJobs }); //vamos renderizar a página Home, quando a rota "/" for acessada.
  }
}

module.exports = HomeController;
