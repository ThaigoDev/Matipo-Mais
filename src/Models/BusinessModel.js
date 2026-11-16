const createRepository = require("../config/repository");

const Business = createRepository("business", {
  businessPhoto: { col: "business_photo", type: "text" },
  businessName: { col: "business_name", type: "text" },
  businessLocation: { col: "business_location", type: "text" },
  businessDescription: { col: "business_description", type: "text" },
  businessContact: { col: "business_contact", type: "json" },
  openingTime: { col: "opening_time", type: "text" },
  closingTime: { col: "closing_time", type: "text" },
  operatingDays: { col: "operating_days", type: "array" },
  businessMapHTML: { col: "business_map_html", type: "text" },
  status: { col: "status", type: "text" },
  datePublish: { col: "date_publish", type: "text" },
  publisher: { col: "publisher", type: "text" },
  categoryName: { col: "category_name", type: "text" },
  categoryID: { col: "category_id", type: "int" },
}, { listing: true });

class BusinessRules {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.business = null;
  }

  async create() {
    this.business = await Business.insert(this.body);
  }

  async read() {
    return Business.findAll();
  }

  async delete(id) {
    this.business = await Business.remove(id);
  }

  async update(id) {
    this.business = await Business.update(id, this.body);
  }

  async getById(id) {
    return Business.findById(id);
  }

  async updateStatus(id, statusChanged) {
    this.business = await Business.update(id, { status: statusChanged }, { touch: false });
  }

  async incrementViews(id) {
    await Business.incrementViews(id);
  }
}

BusinessRules.repository = Business;

module.exports = BusinessRules;
