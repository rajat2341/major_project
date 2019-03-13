var services=require('../services');
var mongoose=require('mongoose');
var models=require('../models');

var saveUser=function (data,callback) {
    var user=new models.users();
    user.username=data.username.toLowerCase();
    user.fullname=data.fname;
    user.password=data.password;
    services.userServices.saveUser(user,data,function (err) {
       if(err){
           callback("Error while saving user");
           return;
       }
       else{
           callback(null);
       }
    });
};

var findUser = function (criteria, projection, option, callback) {
    services.userServices.findUser(criteria, projection, option, (err, user) => {
            if (err) {
                callback(err);
                return;
            } else {
                callback(err, user)
            }
        });
}

module.exports={
    'saveUser' :  saveUser,
    'findUser' :  findUser
};

