const MessagesBR = require("../Models/MessagesModel");

class ContactController {
  static index(req, res) {
    res.render("Contato", {
      sent: req.query.enviado === "1",
      kinds: MessagesBR.KINDS,
      kind: MessagesBR.KINDS[req.query.tipo] ? req.query.tipo : "sugestao",
      ref: {
        type: (req.query.refType || "").slice(0, 20),
        id: parseInt(req.query.refId, 10) || "",
        name: (req.query.refName || "").slice(0, 160),
      },
    });
  }

  static async send(req, res) {
    // Campo invisível para robôs de spam: humanos deixam vazio
    if (req.body.website) return res.redirect("/contato?enviado=1");

    const { erros } = await MessagesBR.create(req.body);
    if (erros.length) {
      req.flash("erros", erros);
      return res.redirect("/contato");
    }
    res.redirect("/contato?enviado=1");
  }
}

module.exports = ContactController;
