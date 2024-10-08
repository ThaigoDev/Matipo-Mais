const express = require("express"); 
const router = express.Router();   
const multer = require("multer"); 
const multerConfig = require("./src/config/multerConfig");
const uploads = multer(multerConfig);
const HomeController = require("./src/Controllers/HomeController"); 
const CategoryController = require("./src/Controllers/CategoryController"); 
const BusinessController = require("./src/Controllers/BusinessController"); 
const LoginAndSignUpController = require("./src/Controllers/LoginAndSignUpController")

//nesse arquivo, vamos definir as rotas da nossa página, por exemplo : www.teste/[rotas que vamos criar]
router.get("/",HomeController.index); //uma rota deve ter um controller, no caso  o controller vai linkar nosso banco de dados com o front end.   
router.get("/quemsomos/"); 
router.post("/category/new",CategoryController.create);  
router.get("/admin/",LoginAndSignUpController.index); 
router.post("/admin/auth",LoginAndSignUpController.auth); 
router.get("/admin/logout",LoginAndSignUpController.logout); 

router.get("/admin/business/",BusinessController.index);  
router.post("/admin/business/new",uploads.single("businessPhoto"),BusinessController.create);  
router.get("/admin/business/delete/:id",BusinessController.delete);  
router.post("/admin/business/update/:id",uploads.single("businessPhotoEdited"),BusinessController.update); 


module.exports = router; 