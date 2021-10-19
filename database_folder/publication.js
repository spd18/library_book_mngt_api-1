//10/08/2021------------------------------------------------------------------

const mongoose = require("mongoose");

//creating Publication schema

const PublicationSchema = mongoose.Schema(
    {
        //column_name: data_type

            id: String,
            pubName: String,
            books: [String]
            
    }
);

const PublicationModel = mongoose.model("publicationsmodel",PublicationSchema); 

module.exports = PublicationModel;
