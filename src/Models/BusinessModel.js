const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BusinessSchema = mongoose.Schema({
  businessPhoto: { type: String, required: false },
  businessName: { type: String, required: true },
  businessLocation: { type: String, required: true },
  businessDescription: { type: String, required: true },
  businessContact: {
    tel: { type: String, required: false },
    whatsApp: { type: String, required: false },
    email: { type: String, required: false },
  },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  operatingDays: { type: [String], required: true },

  businessMapHTML: { type: String, required: false },
  status: { type: String, required: false },
  categoryName: { type: String, required: false },

  categoryID: { type: Schema.Types.ObjectId, ref: "Categories" },
});
const Business = mongoose.model("Business", BusinessSchema);

class BusinessRules {
  constructor(body) {
    this.body = body;
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
    try {
      const business = await Business.find();
      return business;
    } catch (e) {
      throw new Error(e);
    }
  }
  async delete(id) {
    try {
      this.business = await Business.findByIdAndDelete({ _id: id });
    } catch (e) {
      throw new Error(e);
    }
  }
  async update(id) {
    try {
      this.business = await Business.findByIdAndUpdate(id, this.body);
    } catch (e) {
      throw new Error(e);
    }
  }
  async getById(id) {
    try {
      const business = Business.findOne({ _id: id });
      return business;
    } catch (e) {
      throw new Error(e);
    }
  }
  async updateStatus(id, statusChanged) {
    try {
      this.business = await Business.updateMany(
        { _id: id }, // Filtra o comércio atual
        { $set: { status: statusChanged } }
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
module.exports = BusinessRules;
