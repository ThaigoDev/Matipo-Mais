const express  = require("express"); 
const mongoose = require("mongoose"); 
const path = require("path");    
const CronJob = require("cron").CronJob; 
const nodeCron = require("node-cron");
const flash = require("connect-flash");  
const MongoStore= require("connect-mongo"); 
const session =require("express-session");   
const GlobalMiddleware = require("./src/Middlewares/middlewares"); 
const  cronJobs = require("./src/config/cronJobs")
const app = express();  
const router = require("./routes"); 
require("dotenv").config();  
nodeCron.schedule('* * * * *',cronJobs);

app.use(express.urlencoded({extended:true}));   
app.use(express.static("public")); //definindo onde nossos arquivos do front-end vão ficar
app.set("view engine", 'ejs'); //definindo qual motor vai ser usado para renderizar o html na tela.
app.set("views",path.resolve(__dirname, "src","Views")); //  definido onde esse HTML vai estar
const sessionOptions = session({
    secret:"Sessions", 
    store:MongoStore.create({mongoUrl:process.env.URI_CONNECTION}), 
    resave:false, 
    saveUninitialized:false, 
    cookie:{
        maxAge: 1000 * 60 * 60 *7,  
        httpOnly:true
    }
}) 
app.use(sessionOptions)
app.use(flash());  
app.use(GlobalMiddleware)
mongoose.connect(process.env.URI_CONNECTION).then(()=>{ 
    //Aqui estamos realizando a conexão com o banco de dados: MONGO DB 

    console.log("Conecting..."); //vamos mostrar no terminal que a conexão está sendo feita
    app.emit("Conected on Database!") //quando a conexão for feita, o servidor vai emitir uma mensagem
})  


app.on("Conected on Database!",()=>{ 
    //quando o servidor receber o status  "Conected on Database!" o servidor vai escutar na porta 3000 que está  
    //no arquivo .env (esse arquivo contem nossas variáveis de ambiente, essas variáveis contem informações importantes de conexão...)
    app.listen(process.env.PORT,()=>{
        console.log("Acesse : http://localhost:3000/ ")
    })
}) 
app.use(router);
cronJobs();