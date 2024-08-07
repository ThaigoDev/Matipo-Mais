class HomeController{
    static index (req,res)  {
        res.render("Home");  //vamos renderizar a página Home, quando a rota "/" for acessada.
    }
} 

module.exports = HomeController; 