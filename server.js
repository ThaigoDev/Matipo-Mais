const express  = require("express"); 
const mongoose = require("mongoose"); 
const path = require("path");  
const app = express();  
const router = require("./routes"); 
require("dotenv").config(); 

app.use(express.urlencoded({extended:true})); 
app.use(express.static("public")); 
app.set("view engine", 'ejs'); 
app.set("views",path.resolve(__dirname, "src","views"));

mongoose.connect(process.env.URI_CONNECTION).then(()=>{
    console.log("Conecting..."); 
    app.emit("Conected on Database!")
})  


app.on("Conected on Database!",()=>{
    app.listen(process.env.PORT,()=>{
        console.log("acesse : http://localhost:3000/ ")
    })
}) 

app.use(router);