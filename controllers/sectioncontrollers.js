var services=require('../services');
var mongoose=require('mongoose');
var models=require('../models');

var updateSection = function(sname,details,callback) {
    console.log(details);
    services.UserServices.updateUser(user,details, (err,response) => {
        if(err){
            callback(err);
        }
        else {
            callback(err,response);
        }
    });
};

var createSection =function (data,spic,callback) {
    var section = new models.section();
    section.sectionname =data.sectionname ;
 //   console.log(spic);
    if(spic!=null){
        var filename=spic.originalname;
    }else{
        var filename="default.png"
    }
   // console.log(filename);
    section.sectionphoto =filename;
    section.save(data,function(err){
            if(err){
                callback("Error while saving Section Details!");
                return;
            }
            else{
                callback(null);
            };
        });
};

var findQuestions = function (criteria, projection, option, callback) {
    services.sectionServices.findQuestions(criteria, projection, option, (err, questionlist) => {
            if (err) {
                callback(err);
                return;
            } else {
                callback(err, questionlist)
            }
        }
    );
}

module.exports={
    'createSection' :createSection,
    'findQuestions' : findQuestions
}