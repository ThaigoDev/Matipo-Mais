const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("./src/config/multerConfig");
const uploads = multer(multerConfig);
const { requireAdmin, adminLocals, asyncHandler: h } = require("./src/Middlewares/admin");
const HomeController = require("./src/Controllers/HomeController");
const BusinessHomeController = require("./src/Controllers/BusinessHomeController");
const BusinessController = require("./src/Controllers/BusinessController");
const HousingController = require("./src/Controllers/HousingController");
const HousingHomeController = require("./src/Controllers/HousingHomeController");
const HealthController = require("./src/Controllers/HealthController");
const HealthHomeController = require("./src/Controllers/HealthHomeController");
const LeisureController = require("./src/Controllers/LeisureHomeController");
const JobsController = require("./src/Controllers/JobsController");
const JobsHomeController = require("./src/Controllers/JobsHomeController");
const LoginAndSignUpController = require("./src/Controllers/LoginAndSignUpController");
const AboutUsController = require("./src/Controllers/AboutUsController");
const DevelopingPage = require("./src/Controllers/DevelopingPage");
const ContactController = require("./src/Controllers/ContactController");
const AdminController = require("./src/Controllers/AdminController");
const AdminManageController = require("./src/Controllers/AdminManageController");

//nesse arquivo, vamos definir as rotas da nossa página, por exemplo : www.teste/[rotas que vamos criar]

// ---------- Site público ----------
router.get("/", h(HomeController.index)); //uma rota deve ter um controller, no caso  o controller vai linkar nosso banco de dados com o front end.
router.get("/quemsomos/", AboutUsController.index);
router.get("/contato", ContactController.index);
router.post("/contato", h(ContactController.send));
router.get("/business/index", h(BusinessHomeController.index));
router.get("/businessView/:id", h(BusinessController.view));
router.get("/health/index", h(HealthHomeController.index));
router.get("/healthView/:id", h(HealthController.view));
router.get("/housing/index", h(HousingHomeController.index));
router.get("/housingView/:id", h(HousingController.view));
router.get("/jobs/index", h(JobsHomeController.index));
router.get("/jobsView/:id", h(JobsController.view));
router.get("/leisure/index", LeisureController.index);
router.get("/developing/", DevelopingPage.index); //página em desenvolvimento

// ---------- Login ----------
router.get("/admin/", LoginAndSignUpController.index);
router.post("/admin/auth", h(LoginAndSignUpController.auth));
router.get("/admin/logout", LoginAndSignUpController.logout);

// ---------- Painel (tudo abaixo exige login) ----------
const admin = express.Router();
admin.use(requireAdmin, h(adminLocals));

admin.get("/dashboard", h(AdminController.dashboard));
admin.get("/search", h(AdminController.search));

admin.get("/categories", h(AdminManageController.categories));
admin.post("/categories/new", h(AdminManageController.createCategory));
admin.post("/categories/:id/rename", h(AdminManageController.renameCategory));
admin.post("/categories/:id/delete", h(AdminManageController.deleteCategory));

admin.get("/messages", h(AdminManageController.messages));
admin.post("/messages/:id/status", h(AdminManageController.messageStatus));
admin.post("/messages/:id/delete", h(AdminManageController.deleteMessage));

admin.get("/activity", h(AdminManageController.activity));

admin.get("/users", h(AdminManageController.users));
admin.post("/users/new", h(AdminManageController.createUser));
admin.post("/users/:id/delete", h(AdminManageController.deleteUser));

admin.get("/account", h(AdminManageController.account));
admin.post("/account/profile", h(AdminManageController.updateProfile));
admin.post("/account/password", h(AdminManageController.changePassword));

// Comércios, Saúde, Moradia e Empregos compartilham as mesmas rotas
const section = "/:section(business|health|housing|jobs)";
admin.get(`${section}`, h(AdminController.index));
admin.post(`${section}/new`, uploads.single("photo"), h(AdminController.create));
admin.post(`${section}/update/:id`, uploads.single("photo"), h(AdminController.update));
admin.post(`${section}/delete/:id`, h(AdminController.remove));
admin.post(`${section}/duplicate/:id`, h(AdminController.duplicate));
admin.post(`${section}/status/:id`, h(AdminController.toggleStatus));
admin.post(`${section}/featured/:id`, h(AdminController.toggleFeatured));
admin.post(`${section}/bulk`, h(AdminController.bulk));

router.use("/admin", admin);

module.exports = router;
