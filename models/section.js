var mongoose = require('mongoose');

var section = mongoose.Schema({
        sectionname                           :String,
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

module.exports= mongoose.model('sections',section);
