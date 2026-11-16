const LoginAndSignUpBR = require("../Models/LoginAndSignUpModel");
const ActivityLog = require("../Models/ActivityLogModel");

class LoginAndSignUpController {
  static index(req, res) {
    // Quem já está logado vai direto para o painel
    if (req.session.user && req.session.user._id) return res.redirect("/admin/dashboard");
    res.render("LoginPage");
  }

  static async auth(req, res) {
    const loginAndSignUpBR = new LoginAndSignUpBR(req.body);
    await loginAndSignUpBR.auth();
    if (loginAndSignUpBR.erros.length > 0) {
      req.flash("erros", loginAndSignUpBR.erros);
      return res.redirect("/admin/");
    }
    // Nova sessão a cada login (evita fixação de sessão)
    req.session.regenerate(async (err) => {
      if (err) return res.redirect("/admin/");
      req.session.user = loginAndSignUpBR.account;
      await ActivityLog.log(req.session.user, "login", "account", req.session.user._id, req.session.user.name);
      req.flash("success", `Bem-vindo(a) de volta, ${req.session.user.name}!`);
      res.redirect("/admin/dashboard");
    });
  }

  static logout(req, res) {
    // Espera a sessão ser removida do banco antes de redirecionar
    req.session.destroy(() => res.redirect("/admin/"));
  }
}

module.exports = LoginAndSignUpController;
