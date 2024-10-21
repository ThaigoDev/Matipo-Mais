const HousingBR = require("../Models/HousingModel");
class HousingController {
     static async  index (req,res) { 
        const housingBR = new HousingBR();
        const allHousing = await housingBR.read();
      res.render("HousingHomePage",{allHousing}); 
     }
} 
module.exports =HousingController