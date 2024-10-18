class LeisureController{
  static async index(req,res) {
    try{
        res.render("LeisureHomePage")
    }catch(e){

    }
  }
} 
module.exports = LeisureController; 