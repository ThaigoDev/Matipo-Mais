const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BusinessSchema = mongoose.Schema({
  businessName: { type: String, required: true },
  businessLocation: { tyoe: String, required: true },
  businessDescription: { type: String, required: true },
  businessContact: {
    tel: { type: String, required: true },
    whatssApp: { type: String, required: true },
    email: { type: String, required: true },
  },
  openingHours: { type: String, required: true },
  categoryID: { type: Schema.Types.ObjectId, ref: "Categories" },
});
const Business = mongoose.model("Business", BusinessSchema);

class BusinessRules {
  constructor(body) {
    this.body;
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
  async read() {}
  async delete() {}
  async update() {}
}
module.exports = BusinessRules;
