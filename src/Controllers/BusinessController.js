const BusinessRules = require("../ Models/BusinessModel")
class BusinessController {
    static async create(req,res) {
         try {
            const businessBR = new BusinessRules(req.body); 
            await  businessBR.create();  
            res.redirect("back"); 
         }  catch(e) {
            res.status(502).json({
                title:"failed", 
                erros: console.error(e), 
            }); 
         }
    }
} 
module.exports =BusinessController; 