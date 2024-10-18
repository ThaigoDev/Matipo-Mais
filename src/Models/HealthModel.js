const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HealthSchema = mongoose.Schema({
  healthName: { type: String, required: true },
  healthLocation: { type: String, required: true },
  status: { type: String, required: true },
  datePublish: { type: String, required: true },
  publisher: { type: String, required: true },
  healthDescription: { type: String, required: false },
  healthContactInfos: {
    whatsApp: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
  },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  operatingDays: { type: [String], required: true },
  daysOnDuty: { type: [String], required: true },
  healthPhoto: { type: String, required: false },
  healthHTMLMap: { type: String, required: false },
  categoryName: { type: String, required: false },
  categoryID: { type: Schema.Types.ObjectId, ref: "Categories" },
});

const HealthModel = mongoose.model("Health", HealthSchema);

class HealthBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.health = null;
  }
  async create() {
    try {
      this.health = await HealthModel.create(this.body);
    } catch (e) {
      throw new Error(e);
    }
  }
  async read() {
    try {
      const allHealth = await HealthModel.find();
      return allHealth;
    } catch (e) {
      throw new Error(e);
    }
  }
  async update(id) {
    try {
      this.health = await HealthModel.findByIdAndUpdate({ _id: id }, this.body);
    } catch (e) {
      throw new Error(e);
    }
  }
  async delete(id) {
    try {
      this.health = await HealthModel.findByIdAndDelete(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = HealthBR;
