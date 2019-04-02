var mongoose = require('mongoose');

var examsection = mongoose.Schema({
        sectionname                           :String,
        examinstructions                      :String,
        examname                              :String,
        sectionphoto                          :String,
        questionlist                          :[{ qname  :String,
                                                  qcode    :{
                                                        "problem":String,
                                                        "inputformat":String,
                                                        "outputformat":String,
                                                        "constraints":String},
                                                  qlevel :String,
                                                  qscore: {  type:Number },
                                                  qsolutions:{
                                                      type : Array , "default" : [] },
                                                  isAttempted: Boolean
        } ]
    },
);

module.exports = mongoose.model('examsections', examsection);
