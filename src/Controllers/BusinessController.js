const BusinessRules = require("../ Models/BusinessModel"); 
const CategoryRules = require("../ Models/CategoryModels"); 
class BusinessController {
    static async create(req,res) {
         try { 
           const  categoryBR =  new CategoryRules (req.body);   
           const categoryFinded =  await categoryBR.findByCategory(req.body.categoryName); 
            let body = {...req.body,categoryID: categoryFinded._id};
            const businessBR = new BusinessRules(body);  
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