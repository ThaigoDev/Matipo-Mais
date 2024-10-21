const HealthBR= require("../Models/HealthModel"); 

class HealthHomeController  {
    static  async  index(req,res) { 
        const healthBR = new HealthBR();
        const allHealth =   await healthBR.read();
        res.render("HealthHomePage",{allHealth});
    }
} 
module.exports = HealthHomeController; 