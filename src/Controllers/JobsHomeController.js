const JobsBR = require("../Models/JobsModel");
class JobsHomeController {
  static async index(req, res) {
    try {  
      const jobsBR = new JobsBR();
      const allJobs = await jobsBR.read();
        res.render("JobsHome",{allJobs});
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
} 
module.exports = JobsHomeController; 
