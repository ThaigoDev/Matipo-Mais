class IndividualPageController {
    static async index(req, res) {
    res.render("IndividualPage"); //vamos renderizar a página Home, quando a rota "/" for acessada.
      }
}
module.exports = IndividualPageController;