var mongoose=require('mongoose');
var models=require('../models');

var saveUser =function (user,data,callback) {
    user.save(data,function (error,user) {
        if(error){
            callback(error);
        }else{
            callback(null,user);
        }
    })
};

var findUser = function (criteria, projections, options, callback) {
    options.lean = true;
    models.users.find(criteria, projections, options, callback);
}

module.exports={
    'saveUser': saveUser,
    'findUser': findUser
}
