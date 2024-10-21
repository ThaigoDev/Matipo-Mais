const express = require("express"); 
const router = express.Router();   
const multer = require("multer"); 
const multerConfig = require("./src/config/multerConfig");
const uploads = multer(multerConfig);
const HomeController = require("./src/Controllers/HomeController"); 
const CategoryController = require("./src/Controllers/CategoryController"); 
const BusinessHomeController = require("./src/Controllers/BusinessHomeController"); 
const BusinessController = require("./src/Controllers/BusinessController");   
const HousingController = require("./src/Controllers/HousingController");   
const HousingHomeController = require("./src/Controllers/HousingHomeController")
const HealthController = require("./src/Controllers/HealthController"); 
const HealthHomeController = require("./src/Controllers/HealthHomeController");
const LeisureController = require("./src/Controllers/LeisureHomeController")
const JobsController = require("./src/Controllers/JobsController"); 
const JobsHomeController = require("./src/Controllers/JobsHomeController")
const LoginAndSignUpController = require("./src/Controllers/LoginAndSignUpController"); 
const IndividualPageController = require("./src/Controllers/IndividualPageController");


//nesse arquivo, vamos definir as rotas da nossa página, por exemplo : www.teste/[rotas que vamos criar]
router.get("/",HomeController.index); //uma rota deve ter um controller, no caso  o controller vai linkar nosso banco de dados com o front end.   
router.get("/business/index",BusinessHomeController.index); 
router.get("/quemsomos/");  
router.post("/category/new",CategoryController.create);  
router.get("/admin/",LoginAndSignUpController.index); 
router.post("/admin/auth",LoginAndSignUpController.auth); 
router.get("/admin/logout",LoginAndSignUpController.logout); 
//Comércio Routes
router.get("/admin/business/",BusinessController.index);  
router.post("/admin/business/new",uploads.single("businessPhoto"),BusinessController.create);  
router.get("/admin/business/delete/:id",BusinessController.delete);  
router.post("/admin/business/update/:id",uploads.single("businessPhotoEdited"),BusinessController.update); 
//Moradia Routes
router.get("/admin/housing/",HousingController.index);  
router.post("/admin/housing/new",uploads.single("housingPhoto"),HousingController.create);  
router.get("/admin/housing/delete/:id",HousingController.delete);
router.post("/admin/housing/update/:id",uploads.single("housingPhotoEdited"),HousingController.update);    
router.get("/housing/index",HousingHomeController.index )
//Emprego Routes  
router.get("/jobs/index",JobsHomeController.index); 
router.get("/admin/jobs/",JobsController.index);   
router.post("/admin/jobs/new",uploads.single("jobPhoto"),JobsController.create);  
router.get("/admin/jobs/delete/:id",JobsController.delete);  
router.post("/admin/jobs/update/:id",uploads.single("jobPhotoEdited"),JobsController.update); 
//saúde Routes 
router.get("/health/index",HealthHomeController.index)
router.get("/admin/health/",HealthController.index);  
router.post("/admin/health/new",uploads.single("healthPhoto"),HealthController.create);
router.post("/admin/health/update/:id",uploads.single("healthPhotoEdited"),HealthController.update); 
router.get("/admin/health/delete/:id",HealthController.delete);   
//Lazer routes 

router.get("/leisure/index",LeisureController.index); 
router.get("/view",IndividualPageController.index);
module.exports = router; 