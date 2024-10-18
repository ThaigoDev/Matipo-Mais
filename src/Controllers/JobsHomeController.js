class JobsHomeController {
  static async index(req, res) {
    try { 
        res.render("JobsHome");
    } catch (e) {
      res.status(502).json({
        title: "failed",
        erros: console.error(e),
      });
    }
  }
} 
module.exports = JobsHomeController; 
