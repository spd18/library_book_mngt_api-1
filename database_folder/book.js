//10/08/2021------------------------------------------------------------------

const mongoose = require("mongoose");

//creating book schema

const BookSchema = mongoose.Schema(
    {
        //column_name: data_type

            ISBN: String,
            title: String,
            pubDate: String,//yyyy-mm-dd
            language: String,
            numPage: Number,
            author: [Number],//foreign key of author array
            publications: [Number],
            category: [String]
            
    }
);

//model(model_nm,schema);
const BookModel = mongoose.model("booksmodel",BookSchema); /* in mongoBD there is database name called Booky inside it, it has collections (tables) called books. */

module.exports = BookModel;