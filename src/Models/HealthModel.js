const createRepository = require("../config/repository");

const Health = createRepository("health", {
  healthPhoto: { col: "health_photo", type: "text" },
  healthName: { col: "health_name", type: "text" },
  healthLocation: { col: "health_location", type: "text" },
  healthDescription: { col: "health_description", type: "text" },
  healthContactInfos: { col: "health_contact_infos", type: "json" },
  openingTime: { col: "opening_time", type: "text" },
  closingTime: { col: "closing_time", type: "text" },
  operatingDays: { col: "operating_days", type: "array" },
  daysOnDuty: { col: "days_on_duty", type: "array" },
  healthHTMLMap: { col: "health_html_map", type: "text" },
  status: { col: "status", type: "text" },
  datePublish: { col: "date_publish", type: "text" },
  publisher: { col: "publisher", type: "text" },
  categoryName: { col: "category_name", type: "text" },
  categoryID: { col: "category_id", type: "int" },
}, { listing: true });

class HealthBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.health = null;
  }

  async create() {
    this.health = await Health.insert(this.body);
  }

  async read() {
    return Health.findAll();
  }

  async update(id) {
    this.health = await Health.update(id, this.body);
  }

  async delete(id) {
    this.health = await Health.remove(id);
  }

  async getById(id) {
    return Health.findById(id);
  }

  async updateStatus(id, statusChanged) {
    this.health = await Health.update(id, { status: statusChanged }, { touch: false });
  }

  async incrementViews(id) {
    await Health.incrementViews(id);
  }
}

HealthBR.repository = Health;

module.exports = HealthBR;
