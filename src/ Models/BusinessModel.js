const mongoose = require("mongoose"); 

const BusinessSchema = mongoose.Schema({
    businessName : {type:String, required:true}, 
    businessLocation:{tyoe:String,required:true},  
    businessDescription:{type:String,required:true}, 
    businessContact:{
        tel:{type:String,required:true}, 
        WhatssApp:{type:String,required:true}, 
        email:{type:String,required:true}, 
    }, 
    openingHours:{type:String,required:true}
}) 
const Business = mongoose.model("Business",BusinessSchema);  

class BusinessRules {
    constructor(body) {
        this.body; 
        this.erros = []; 
        this.business = null; 
    }
    async create(){

    }; 
    async read() {

    }; 
    async delete() {

    }; 
    async  update() {

    }
}  
module.exports=  BusinessRules; 

