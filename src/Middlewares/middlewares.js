 function GlobalMiddleware(req,res,next) {
    res.locals.erros = req.flash("erros"); 
    res.locals.success = req.flash("success");   
    res.locals.user = req.session.user;
    next(); 

} 
module.exports = GlobalMiddleware