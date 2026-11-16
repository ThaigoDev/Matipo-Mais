const createRepository = require("../config/repository");

const Housing = createRepository("housing", {
  housingPhoto: { col: "housing_photo", type: "text" },
  housingName: { col: "housing_name", type: "text" },
  housingLocation: { col: "housing_location", type: "text" },
  housingDescription: { col: "housing_description", type: "text" },
  housingContactInfos: { col: "housing_contact_infos", type: "json" },
  roomsQTD: { col: "rooms_qtd", type: "int" },
  bathroomsQTD: { col: "bathrooms_qtd", type: "int" },
  housingHTMLMap: { col: "housing_html_map", type: "text" },
  status: { col: "status", type: "text" },
  datePublish: { col: "date_publish", type: "text" },
  publisher: { col: "publisher", type: "text" },
  categoryName: { col: "category_name", type: "text" },
  categoryID: { col: "category_id", type: "int" },
}, { listing: true });

class HousingBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.housing = null;
  }

  async create() {
    this.housing = await Housing.insert(this.body);
  }

  async read() {
    return Housing.findAll();
  }

  async delete(id) {
    this.housing = await Housing.remove(id);
  }

  async update(id) {
    this.housing = await Housing.update(id, this.body);
  }

  async getById(id) {
    return Housing.findById(id);
  }

  async incrementViews(id) {
    await Housing.incrementViews(id);
  }
}

HousingBR.repository = Housing;

module.exports = HousingBR;
