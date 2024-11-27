const nodeCron = require("node-cron");
const BusinessRules = require("../Models/BusinessModel"); 
const HealthBR= require("../Models/HealthModel"); 

const businessBR = new BusinessRules({}); 
const healthBR = new HealthBR({});
 async function changeStatus () {
    const currentTime  = new Date(); 
    const currentHour =currentTime.getHours(); 
    const currentMinutes  =currentTime.getMinutes();   
    const allBusiness = await businessBR.read(); 
    allBusiness.forEach(async (bsn)=>{
        const [closingHour, closingMinute] = bsn.closingTime.split(':').map(Number);  
        const [openingHour, openingMinute] = bsn.openingTime.split(':').map(Number); 
        if (  (currentHour >= closingHour && currentMinutes >= closingMinute)|| (currentHour < openingHour) ) {
            // Atualizar o status para "Fechado"
            await businessBR.updateStatus( bsn._id , "Fechado" ); 
          }else if((currentHour >= openingHour  && currentHour <= closingHour)||currentHour <closingHour ) {
            await businessBR.updateStatus( bsn._id , "Aberto" );  

          }
    }) 
  const allHealth = await  healthBR.read(); 
  allHealth.forEach(async (health)=>{
      const [closingHour, closingMinute] = health.closingTime.split(':').map(Number);  
      const [openingHour, openingMinute] = health.openingTime.split(':').map(Number); 
      if (  (currentHour >= closingHour && currentMinutes >= closingMinute)|| (currentHour < openingHour) ) {
          // Atualizar o status para "Fechado"
          await healthBR.updateStatus( health._id , "Fechado" ); 
        }else if((currentHour >= openingHour  && currentHour <= closingHour)||currentHour <closingHour ) {
          await healthBR.updateStatus( health._id , "Aberto" );  

        }
  })
 }

module.exports = changeStatus;
