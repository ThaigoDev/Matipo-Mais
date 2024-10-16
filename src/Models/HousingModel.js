const mongoose = require("mongoose");
const HousingSchema = mongoose.Schema({
  name: { type: String, required: true },
  housingPhoto: { type: String, required: true },
  location: { type: String, required: true },
  roomsQTD: { type: Number, required: false },
  bathroomsQTD: { type: Number, required: false },
  status: { type: String, required: true },
  date: { type: String, required: true },
  publisher: { type: String, required: true },
  housingContactInfos: {
    whatsApp: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
  },
});
 
const housingModel = mongoose.Model("Housing",HousingSchema); 

class HousingBR  { 
    constructor(body) {
        this.body = body; 
        this.erros = []; 
        this.housing = null 
    } 
    async create() {
        try{
        this.housing = housingModel.create(this.body); 
        }catch(e) {
            throw new Error(e); 
        }
    } 
    async read() {
        try{

        }catch(e) {
            throw new Error(e);
        }
    } 
    async update(id) {
    try{

    }catch(e){
        throw new Error(e); 
    }
    } 
    async delete(id) {
        try{

        }catch(e) {
            throw new Error(e); 
        }
    }
}    
module.exports =  HousingBR; 