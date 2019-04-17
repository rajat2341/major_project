var mongoose = require('mongoose');

var examsection = mongoose.Schema({
        sectionname                           :String,
        examinstructions                      :String,
        examname                              :String,
        sectionphoto                          :String,
        userInfo:[{
            user : String,
            isEAttempted: Boolean,
        }],
        questionlist                          :[{ qname  :String,
                                                  qcode    : {
                                                        "problem":String,
                                                        "inputformat":String,
                                                        "outputformat":String,
                                                        "constraints":String},
                                                  qsolutions: { score : Number,
                                                                code : String
                                                            },
                                                  qusersolutions: [{
                                                       user : String , 
                                                        score : Number,
                                                        code : String,
                                                     }],                   
        }]
    },
);

module.exports = mongoose.model('examsections', examsection);
