var mongoose = require('mongoose');


var login = mongoose.Schema({
        username                            :String,
        password                            :String,
        fullname                            :String,
        googleId                            :String,
        googleToken                         :String,
        userscore                           :[{type:Number,"default":0}]
    },
);

module.exports= mongoose.model('userlists',login);
