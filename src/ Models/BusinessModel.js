const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BusinessSchema = mongoose.Schema({
  businessName: { type: String, required: true },
  businessLocation: { type: String, required: true },
  businessDescription: { type: String, required: true },
  businessContact: {
    tel: { type: String, required: false },
    whatsApp: { type: String, required: false },
    email: { type: String, required: false },
  },
  openingHours: { type: String, required: true }, 
  categoryID: { type: Schema.Types.ObjectId, ref: "Categories" },
});
const Business = mongoose.model("Business", BusinessSchema);

class BusinessRules {
  constructor(body) {
    this.body =body;
    this.erros = [];
    this.business = null;
  }
  async create() {
    try {
      this.business = await Business.create(this.body);
    } catch (e) {
      throw new Error(e);
    }
  }
  async read() { 
    try{
      const business = await Business.find(); 
      return business; 
    }catch(e) {
      throw new Error(e); 
    }
  }
  async delete() {}
  async update() {} 
  
}
module.exports = BusinessRules;
