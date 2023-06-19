module.exports = {
    ensureAuth: function (req, res, next) {
        console.log("ensureAuth is running")
        if (req.isAuthenticated()) {
        
         } else {
            console.log("getting redirected")
        res.redirect("/");
        } next();
    } 
};