const createRepository = require("../config/repository");

const Jobs = createRepository("jobs", {
  jobPhoto: { col: "job_photo", type: "text" },
  jobName: { col: "job_name", type: "text" },
  jobLocation: { col: "job_location", type: "text" },
  jobDescription: { col: "job_description", type: "text" },
  jobContact: { col: "job_contact", type: "json" },
  openingTime: { col: "opening_time", type: "text" },
  closingTime: { col: "closing_time", type: "text" },
  operatingDays: { col: "operating_days", type: "array" },
  jobMapHTML: { col: "job_map_html", type: "text" },
  status: { col: "status", type: "text" },
  businessName: { col: "business_name", type: "text" },
  datePublish: { col: "date_publish", type: "text" },
  publisher: { col: "publisher", type: "text" },
  categoryName: { col: "category_name", type: "text" },
  categoryID: { col: "category_id", type: "int" },
}, { listing: true });

class JobsBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.job = null;
  }

  async create() {
    this.job = await Jobs.insert(this.body);
  }

  async read() {
    return Jobs.findAll();
  }

  async update(id) {
    this.job = await Jobs.update(id, this.body);
  }

  async delete(id) {
    this.job = await Jobs.remove(id);
  }

  async getById(id) {
    return Jobs.findById(id);
  }

  async incrementViews(id) {
    await Jobs.incrementViews(id);
  }
}

JobsBR.repository = Jobs;

module.exports = JobsBR;
