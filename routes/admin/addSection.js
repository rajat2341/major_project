var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var bodyParser  = require('body-parser');
const controllers= require('../../controllers');
var helper= require('../../helper');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

router.get('/addSection',helper.common.isLoggedIn,function (req,res) {
     res.render('admin/mainPage',{ user: req.session.user, err: req.flash('msg'),styletag:'alert-danger'});
});

var upload = multer({
    dest:'public/upload/sectionPics/'
});

router.post('/addSection', upload.single('sectionpic'),function (req,res) {
     var sname=req.body.sectionname;
     //console.log(req.file);
    if (sname == "" ) {
        req.flash('msg',"Section Name cannot be Empty!");
        res.redirect('/admin/add');
    }else {
         controllers.sectionControllers.createSection(req.body,req.file,function (err,response) {
            if(err){
                req.flash('msg',err);
                res.redirect('/add');
            }else{
                res.render('admin/mainPage',{ user: req.session.user, err: "Section Added!",styletag:'alert-info'});
            }
        });
    }
});

router.get('/addquestions',function (req,res) {
    res.render('admin/addQuestions',{ user: req.session.user, err: req.flash('msg'),styletag:'alert-danger'});
});
module.exports = router;