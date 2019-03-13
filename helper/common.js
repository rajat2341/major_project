function isLoggedIn(req,res,next) {
    if(req.isAuthenticated())
        return next();
    req.flash('error',"Please Login first!");
    res.redirect('/');
}

module.exports ={
    'isLoggedIn'    :isLoggedIn
}