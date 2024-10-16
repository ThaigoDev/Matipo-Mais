const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;
const HousingSchema = mongoose.Schema({
  housingName: { type: String, required: true },
  housingLocation: { type: String, required: true },
  roomsQTD: { type: Number, required: false },
  bathroomsQTD: { type: Number, required: false },
  status: { type: String, required: true },
  datePublish: { type: String, required: true },
  publisher: { type: String, required: true }, 
  housingDescription:{type:String,required:false}, 
  housingContactInfos: {
      whatsApp: { type: String, required: false },
      phone: { type: String, required: false },
      email: { type: String, required: false },
    },
    housingPhoto: { type: String, required: false }, 
    housingHTMLMap:{type:String,required:false}, 
    categoryID: { type: Schema.Types.ObjectId, ref: "Categories" },
});
 
const housingModel = mongoose.model("Housing",HousingSchema); 

class HousingBR  { 
    constructor(body) {
        this.body = body; 
        this.erros = []; 
        this.housing = null 
    } 
    async create() {
        try{
         this.housing = await housingModel.create(this.body); 
        }catch(e) {
            throw new Error(e); 
        }
    } 
    async read() {
        try{
            const housingAll = await housingModel.find(); 
            return housingAll;
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