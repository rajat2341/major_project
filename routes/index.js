var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var bodyParser  = require('body-parser');
const controllers= require('../controllers');
var multer = require('multer');
var helper=require('../helper');
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res, next) {
    if(req.session.user){
        res.render('index', { user : req.session.user , err : req.flash('error'), styletag : 'alert-danger' });
    }
    else{
        res.render('index', { user : null, err : req.flash('error'), styletag : 'alert-danger' });
    }
});

router.post('/login',passport.authenticate('local-login', { failureRedirect:'/' }), function (req, res) {
    username = req.body.username;
    req.session.user = username;
    if (req.body.username == 'admin') {
        res.redirect('/admin/addSection');
    }
    else {
        res.render('index', { user : username, err: 'Welcome '+username , styletag : 'alert-info'});
    }
});

router.get('/signup', function (req, res, next) {
    req.session.destroy();
    res.render('user/signup', {title: 'SignUp', msg: '',user:''});
});

router.post('/signup', function (req, res) {
        username = req.body.username;
        if (req.body.username == "" && req.body.fname == "" && req.body.password == "" && req.body.cpassword == "") {
            res.render('user/signup', { user: '', msg: 'No field can be empty'})
        } else {
            if (req.body.password==req.body.cpassword) {
                controllers.userControllers.findUser({username: req.body.username}, {username: 1}, {}, (err, response) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        //console.log("hlo "+response[0]);
                        if (response[0] != undefined) {
                            if (response[0].username == req.body.username) {
                                res.render('user/signup', { user:username, msg: 'This Username Already Exist!'})
                            }
                        } else {
                            controllers.userControllers.saveUser(req.body, (err, response) => {
                                if (err) {
                                    res.render('user/signup', { user: username.user, msg: err})
                                }
                                else {
                                    req.session.user = username;
                                    res.render('index', { user: username, err: 'Welcome '+username,styletag:'alert-info'})
                                }
                            })
                        }
                    }
                });
            }
            else {
                res.render('user/signup', { user:'',  msg: 'Both Passwords donot match!'});
            }
        }
    }
);



router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',passport.authenticate('google',{ failureRedirect : '/' }), function (req,res) {
    console.log(res);
    res.render('index', { user : res.name.givenName, err: 'Welcome '+ res.name.givenName , styletag : 'alert-info'});
});

router.get('/section/:sectionname',function (req,res) {
    var sectionname =req.params.sectionname;
    req.session.sname=sectionname;
    controllers.sectionControllers.findQuestions({sectionname:sectionname},{},{},(err,sectiondetail)=>{
        if(err){
            res.status(400).send(err);
        }else {
            res.render('section/problemList', {user: req.session.user, data: sectiondetail[0]});
        }
    });
});

router.get('/challenges/:qname/:id/problem',function (req,res) {
   var qid=req.params.id;
   var sname=req.session.sname;
    controllers.sectionControllers.findQuestions({sectionname:sname},{questionlist:1},{},(err,sectiondetail)=>{
        if(err){
            res.status(400).send(err);
        }else {
            res.render('section/problemCode', {
                user: req.session.user,
                data: sectiondetail[0].questionlist[qid],
                sname: sname
            });
        }
    });
});


router.get('/index/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
