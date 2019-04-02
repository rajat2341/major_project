var services=require('../services');
var mongoose=require('mongoose');
var models=require('../models');

var findQuestions = function (criteria, projection, option, callback) {
    services.examsectionServices.findQuestions(criteria, projection, option, (err, examname) => {
            if (err) {
                callback(err);
                return;
            } else {
                callback(err, examname)
            }
        }
    );
}

module.exports={
    'findQuestions' : findQuestions
}