const mongoose = require('mongoose');
const models = require('../models');
var helper = require('../helper');

var findQuestions =function (criteria,projection,option,callback) {
    models.section.find(criteria, projection, option, callback);
}

module.exports = {
    'findQuestions' :findQuestions
}