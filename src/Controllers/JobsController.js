const JobsBR = require("../Models/JobsModel");

// Página pública de detalhe (o gerenciamento fica em AdminController)
class JobsController {
  static async view(req, res) {
    const rules = new JobsBR();
    const job = await rules.getById(req.params.id);
    if (!job) return res.redirect("/jobs/index");
    // Visitas de administradores logados não contam
    if (!req.session.user) await rules.incrementViews(job._id);
    res.render("IndividualPageJobs", { job });
  }
}

module.exports = JobsController;
