const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;
const JobsSchema = mongoose.Schema({
  jobPhoto: { type: String, required: false },
  jobName: { type: String, required: true },
  jobLocation: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobContact: {
    phone: { type: String, required: false },
    whatsApp: { type: String, required: false },
    email: { type: String, required: false },
  },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  operatingDays: { type: [String], required: true },
  jobMapHTML: { type: String, required: false },   
  status: { type: String, required: false },   
  businessName: { type: String, required: false },  
  categoryName: { type: String, required: true },
  categoryID: { type: Schema.Types.ObjectId, ref: "Categories" },
});
const JobModel = mongoose.model("Jobs", JobsSchema);

class JobsBR {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.job = null;
  }
  async create() {
    try {
      this.job = await JobModel.create(this.body);
    } catch (e) {
      throw new Error(e);
    }
  }
  async read() {
    try {
      const allJobs = await JobModel.find();
      return allJobs;
    } catch (e) {
      throw new Error(e);
    }
  }
  async update(id) {
    try {
      this.job = await JobModel.findByIdAndUpdate({ _id: id }, this.body);
    } catch (e) {
      throw new Error(e);
    }
  }
  async delete(id) {
    try {
      this.job = await JobModel.findByIdAndDelete(id);
    } catch (e) {
      throw new Error(e);
    }
  } 
  async getById(id) {
    try{
        const job = JobModel.findOne({_id:id});  
        return job; 
    }catch(e) {
        throw new Error(e); 
    }
}
} 
module.exports = JobsBR; 
