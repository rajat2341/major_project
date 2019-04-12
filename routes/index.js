var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var bodyParser  = require('body-parser');
const controllers = require('../controllers');
var multer = require('multer');
var helper=require('../helper');
var path = require('path');
var fs = require('fs');
var compiler = require('compilex');
var options = {stats : true}; //prints stats on console 
compiler.init(options);


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
    var sectionname = req.params.sectionname;
    req.session.sname = sectionname;
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

router.get('/onlineExam', function(req, res){
    var sectionname = "onlineExam";
    var msg = req.session.redirectmsg;
    delete req.session.redirectmsg;
    controllers.examsectionControllers.findQuestions({sectionname : sectionname},{},{},(err, examsectiondetail)=>{
        if(err){
            res.status(400).send(err);
        } else {
            res.render('section/exam/examMain', {msg: msg, user: req.session.user, data: examsectiondetail[0]});
        }
    });
});

router.get('/examQuestionList/:examname', function(req, res){
    var examname = req.params.examname;
    req.session.examname = examname;
    var username = req.session.user;
    controllers.examsectionControllers.findQuestions({examname : examname},{},{},(err,examsectiondetail)=>{
        if(err){
            res.status(400).send(err);
        }
        else if(!username){
            req.session.redirectmsg = "Please Login First";
            res.redirect('/onlineExam');
        }
        else{
            res.render('section/exam/questionList', {user: req.session.user, examname: examname, data: examsectiondetail[0]});
        }
    });
});

// router.get('/question/:qname/:id/problem',function (req,res) {
//     var qid=req.params.id;
//     var examname = req.session.examname;
//      controllers.examsectionControllers.findQuestions({examname:examname},{questionlist:1},{},(err,examsectiondetail)=>{
//          if(err){
//              res.status(400).send(err);
//          } else {
//              res.render('section/exam/questionCode', { user: req.session.user, data: examsectiondetail[0].questionlist[qid], examname: examname });
//          }
//      });
//  });

router.post('/Savecode', function (req, res) {
    var code = req.body.code;
});

router.get('/index/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

router.post('/compilecode' , function (req , res ) {
	var code = req.body.code;	
	var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    if((lang === "C") || (lang === "C++"))
    {        
        if(inputRadio === "Yes")
        {    
        	var envData = { OS : "windows" , cmd : "g++", options: {timeout:1000 }};	   	
        	compiler.compileCPPWithInput(envData , code ,input , function (data) {
        		if(data.error)
        		{
        			res.send({out : data.error, type : "error"});    		
        		}
        		else
        		{
        			res.send({ out : data.output, type :"success"});
        		}
        	});
	   }
	   else
	   {
	   	var envData = { OS : "windows" , cmd : "g++", options: {timeout:1000 }};	   
        	compiler.compileCPP(envData , code , function (data) {
                if(data.error)
                {
                    res.send({out : data.error, type : "error"});
                }    	
                else
                {
                    res.send({ out : data.output, type :"success"});
                }
            });
	   }
    }
    if(lang === "Java")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJavaWithInput( envData , code , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJavaWithInput( envData , code , input ,  function(data){
                res.send(data);
            });

        }

    }
    if( lang === "Python")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input , function(data){
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compilePython(envData , code , function(data){
                res.send(data);
            });
        }
    }
    // compiler.flush(function(){
    //     console.log('All temporary files flushed !'); 
    // });  
});

router.get('/fullStat' , function(req , res ){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

module.exports = router;
