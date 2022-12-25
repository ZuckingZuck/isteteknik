const { response } = require("express");

module.exports = (req, res, next) => {
    if(req?.user?.role == "admin")
    {
        //res.locals.isAuthenticated = req.session.isAuthenticated;
        next(); 
    }
    else{
        res.render("unauth", {
            title: "Yetkisiz Erişim İsteği"
        })
        

    }
    
}