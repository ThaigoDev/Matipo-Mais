const nodeCron = require("node-cron");
const BusinessRules = require("../Models/BusinessModel");
const businessBR = new BusinessRules({});
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
            console.log("status aleterado para fechado")
          }else if((currentHour >= openingHour  && currentHour <= closingHour)|| currentHour < closingHour) {
            await businessBR.updateStatus( bsn._id , "Aberto" );  
            console.log("status aleterado para Aberto")

          }
    })
 }

module.exports = changeStatus;
