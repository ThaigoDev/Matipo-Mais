const mongoose = require("mongoose");
const UserAccountSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmedPassword: { type: String, required: true },
});
const Account = mongoose.model("Accounts", UserAccountSchema);

class LoginAndSignUpBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.account = null;
  }
  async create() {
    try {
    } catch (e) {
      throw new Error(e);
    }
  }
  async auth() {
    try {
      this.account = await  Account.findOne({ email: this.body.email });
      console.log(this.account);
      if (!this.account) {
        this.erros.push("Usuário não encontrado !");
        return;
      }
      if (this.account.password !== this.body.password) {
        this.erros.push("Senha incorreta !");
        return;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = LoginAndSignUpBR;
