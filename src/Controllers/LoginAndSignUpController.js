const LoginAndSignUpBR = require("../ Models/LoginAndSignUpModel");
class LoginAndSignUpController {
  static index(req, res) {
    try {
      res.render("LoginPage");
    } catch (e) {
      res.status(502).json({
        status: "failed",
        error: console.error(e),
      });
    }
  }
  static async auth(req, res) {
    try {
      const loginAndSignUpBR = new LoginAndSignUpBR(req.body);
      await loginAndSignUpBR.auth();
      if (loginAndSignUpBR.erros.length > 0) {
        req.flash("erros", loginAndSignUpBR.erros);
        res.redirect("back");
      } else {
        req.session.user = loginAndSignUpBR.account;
        req.flash("success", "Logado com sucesso!");
        res.redirect("/admin/business/");
      }
    } catch (e) {
      res.status(502).json({
        status: "failed",
        error: console.error(e),
      });
    }
  }
  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/admin/");
    } catch (e) {
      res.status(502).json({
        status: "failed",
        error: console.error(e),
      });
    }
  }
}
module.exports = LoginAndSignUpController;
