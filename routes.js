const express = require("express"); 
const router = express.Router();  
const HomeController = require("./src/controllers/HomeController")
//nesse arquivo, vamos definir as rotas da nossa página, por exemplo : www.teste/[rotas que vamos criar]
router.get("/",HomeController.index); //uma rota deve ter um controller, no caso  o controller vai linkar nosso banco de dados com o front end.   
router.get("/quemsomos/");

module.exports = router; 