const BusinessRules = require("../Models/BusinessModel");
class BusinessHomeController {
  static  async index(req,res) { 
    const businessBR = new BusinessRules(req.body);
   const allBusiness =  await businessBR.read();
    res.render("Comercio",{allBusiness}); 
  }   
} 
module.exports = BusinessHomeController; 