//10/08/2021------------------------------------------------------------------

const mongoose = require("mongoose");

//creating Author schema

const AuthorSchema = mongoose.Schema(
    {
        //column_name: data_type

            id: String,
            name: String,
            books: [String]
            
    }
);

const AuthorModel = mongoose.model("authorsmodel",AuthorSchema); 

module.exports = AuthorModel;
