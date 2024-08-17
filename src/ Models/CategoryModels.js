const mongoose =  require("mongoose");  
const CategorySchema = mongoose.Schema({ 
   category : {type:String ,required:true}, 
}, {timestamp:true}) 

const Category  = mongoose.model("Categories", CategorySchema);  

class CategoryRules  {
    constructor(body) {  
        this.body = body; 
        this.erros = []; 
        this.category = null
    } 
    async create() {
        try {   
            this.category   = await  Category.create(this.body); 
        }catch(e) {
            throw new Error(e); 
        }
    };  
    async read() {

    }
    async update() {

    }  
    async delete() {

    } 
    async findByCategory(categoryName) {
        try {   
            const category = await Category.findOne({category :categoryName})
            return category; 
        }catch(e) {
            throw new Error(e); 
        }
    }

} 
module.exports = CategoryRules; 
