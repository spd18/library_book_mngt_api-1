require("dotenv").config();

//book management project 

//Nodemon: - it will catch the change and render the change into the localhost or server. It is require to install in all project.

const express = require("express");

const mongoose = require("mongoose");

//it allow the express to read the body and parse it into JSON
var bodyParser = require("body-parser");

//Database
const database = require("./database_folder/database");

//Creating Database Modals
const BookModel = require("./database_folder/book");
const AuthorModel = require("./database_folder/author");
const PublicationModel = require("./database_folder/publication");
const { config } = require("dotenv");


//need to connect mongoose with database.
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, 
    useCreateIndex: true
}).then(() => console.log("Database connection established successfully."));

//init express
const booky = express();
//url passing can contain data of various data type like string, int 
//urlencoded(): -   we are allow to pass any kind of data in url 
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//listen port
booky.listen(3000,() => {
    console.log("Server is running");
});



//=============================================================================

//PUT requests

/*
API: - 
Route           /publication/update/book
Description     update or add new publication
Access          Public
Parameter       isbn
Methods         PUT
*/
//two task: - 
//1. update the publication database
//2. update the book database
booky.put("/publication/update/book/:isbn", (req,res) => {
    
    //1. update the publication database
    database.publication.forEach((publ) => {
        if(publ.id == req.body.publID)//post man body
        {
            return publ.books.push(req.params.isbn);
        }
    })

    //2. update the book database
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn){
            book.publications = req.body.publID;//doubt
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    )

});


/*
API: - 
Route           /book/update/
Description     update book using ISBN
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/:isbn", async(req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn   
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true //show the updated data on the front-end
        }
    );

    return res.json({books: updatedBook});

});

/*
API: - 
Route           /book/author/update/
Description     update or add new author
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/author/update/:isbn", async (req,res) => {

    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet:{
                //authors
                author: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    )

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "Author updated successfully"
    })
});//not getting flow



//post-man { publID: 2 } as a body


/****DELETE*****/

/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
    //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
    //and rest will be filtered out
  
    const updatedBookDatabase = database.books.filter(
      (book) => book.ISBN !== req.params.isbn
    )//this will filter out the array in such a way that it will omit requested isbn database.
    database.books = updatedBookDatabase;
  
    return res.json({books: database.books});
});
  

/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
     database.books.forEach((book)=>{
       if(book.ISBN === parseInt(req.params.isbn) ){
         const newAuthorList = book.author.filter(
           (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
         );
         book.author = newAuthorList;
         return;
       }
     });
  
  
    //Update the author database
    database.author.forEach((eachAuthor) => {
      if(eachAuthor.id === parseInt(req.params.authorId)) {
        const newBookList = eachAuthor.books.filter(
          (book) => book !== req.params.isbn
        );
        eachAuthor.books = newBookList;
        return;
      }
    });
  
    return res.json({
      book: database.books,
      author: database.author,
      message: "Author was deleted!!!!"
    });
});
  

/*
Route            /book/delete/
Description      Delete a book based on isbn
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/
booky.delete("/book/delete/:isbn", async (req,res) => {
    const updatedBookDatabase1 = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: updatedBookDatabase1
    });

});//error not working as expected


//=============================================================================

//POST requests

/*
API: - 
Route           /book/new
Description     Add new books
Access          Public
Parameter       None
Methods         POST
*/
booky.post("/book/new", async (req,res) => {
    const { newBook } = req.body;//fetching the data from the body of postman in json format
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "New book is added successfully"
    });

});

//include it into postman


/*
API: - 
Route           /author/new
Description     Add new author
Access          Public
Parameter       None
Methods         POST
*/
booky.post("/author/new", async (req,res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);//error
    return res.json({
        author: addNewAuthor,
        message: "New author is added successfully"
    });

});

/*
API: - 
Route           /publication/new
Description     Add new publication
Access          Public
Parameter       None
Methods         POST
*/
booky.post("/publication/new", (req,res) => {
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);

    return res.json({
        publication: addNewPublication,
        messaage: "New Publication is added successfully"
    });
    
    database.publication.push(newPublication);
    return res.json({updatedPublication: database.publication});
});



//=============================================================================

//Books api
//-----------------------------------------------------------------------------


/*
this is first api. that will return all the books, author and pubication data from the database.
Route           /
Description     Get all the books
Access          Public
Parameter       None
Methods         GET
*/
booky.get("/",async (req,res) => {

    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);

    //return res.json({books: database.books});
})

/*
this is the api. that will return the specific books, author and pubication data from the database based on ISBN number.
Route           /is
Description     Get specific the book on ISBN
Access          Public
Parameter       isbn
Methods         GET
*/
//is -> isbn
booky.get("/is/:isbn",async (req,res) => {
    
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});//it will return single data unlike find return all data.

    // !0 = 1 or say !null = 1 true
    if(!getSpecificBook)//getSpecificBook will return 0 or 1 value
    {
        return res.json({error: `No book found for that ISBN ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook});

});


/*
this is the api. that will return the specific books data from the database based on category.
Route           /c
Description     Get specific the book on category
Access          Public
Parameter       category
Methods         GET
*/
booky.get("/c/:category", async (req,res) => {

    const getSpecificBook = await BookModel.findOne({category: req.params.category});//it will return single data unlike find return all data.

    // !0 = 1 or !null = 1
    if(!getSpecificBook)//getSpecificBook will return 0 or 1 value
    {
        return res.json({error: `No book found for that category ${req.params.category}`});
    }

    return res.json({book: getSpecificBook});

});

/*
this is the api. that will return the specific books data from the database based on language.
Route           /lang
Description     Get specific the book on language
Access          Public
Parameter       language
Methods         GET
*/
booky.get("/lang/:lang", (req,res) => {

    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.lang) //it will ensure the presence of specific elements with the arguments
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for that language ${req.params.lang}`});
    }

    return res.json({book: getSpecificBook});
});


//authors api
//-----------------------------------------------------------------------------


/*
this is the api. that will return the book author data from the database.
Route           /author
Description     Get all the book authors.
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/author", async (req,res) => {
    
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
    
    //return res.json({authors: database.author});
})


/*
this is the api. that will return the author data from the database based on its ID
Route           /author
Description     Get specific author
Access          Public
Parameter       authID
Methods         GET
*/
booky.get("/author/:authID", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.authID)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No author found for the ID of ${req.params.authID}`});
    }

    return res.json({author: getSpecificAuthor});
});


/*
this is the api. that will return the author data from the database based on the books he/she wrote
Route           /author/book
Description     Get all authors based on the books he/she wrote
Access          Public
Parameter       ISBN
Methods         GET
*/
booky.get("/author/book/:isbn", (req,res) => {

      const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No author found for the book of ${req.params.isbn}`});
    }

    return res.json({authors: getSpecificAuthor});
});



//Publication api
//-----------------------------------------------------------------------------


/*
this is the api. that will return all the publication from the database.
Route           /publications
Description     Get all publications
Access          Public
Parameter       None
Methods         GET
*/
booky.get("/publications",async (req,res)  => {
    
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
    //return res.json({publications: database.publication});
})


/*
this is the api. that will return the publication data from the database based on its name
Route           /publication
Description     Get specific publication based on its name
Access          Public
Parameter       name of the publication
Methods         GET
*/
booky.get("/publications/:pubNm", (req,res) => {
    
    const getSpecificPublication = database.publication.filter(
          (publ) => publ.pubName == req.params.pubNm
    );

    if(getSpecificPublication.length === 0)
    {
        return res.json({error: `No publication found for the book of ${req.params.pubNm}`});
    }

    return res.json({Publication: getSpecificPublication});
});


/*
this is the api. that will return the publication data from the database based on the book they published
Route           /publication/book
Description     Get specific publication based on the book they published
Access          Public
Parameter       book isbn number
Methods         GET
*/
booky.get("/publications/book/:isbn", (req,res) => {

    const getSpecificPublication = database.publication.filter(
        (publ) => publ.books.includes(req.params.isbn)
    )

    if(getSpecificPublication.length === 0)
    {
        return res.json({error: `No publication found for the book of ${req.params.isbn}`});
    }

    return res.json({Publication: getSpecificPublication});

});


