const books = [
    {
        ISBN: "12345Book",
        title: "Tesla!!!",
        pubDate: "2021-08-05",//yyyy-mm-dd
        language: "English",
        numPage: 250,
        author: [1],//foreign key of author array
        category: ["tech","space","education"],
        publications: [1]
    },

    {
        ISBN: "123Book",
        title: "Google!!!",
        pubDate: "2021-08-05",//yyyy-mm-dd
        language: "Hindi",
        numPage: 350,
        author: [3],//foreign key of author array
        category: ["tech","education"],
        publications: [2]
    }
]

const author = [
    {
        id: 1,
        name: "Author 1",
        books: ["12345Book","secretBook"]
    },
    {
        id: 2,
        name: "Author 2",
        books: ["12345Book"]
    },
]

const publication = [
    {
        id: 1,
        pubName: "writex",
        books: ["12345Book"]
    },
    {
        id: 2,
        pubName: "writex2",
        books: []
    }
]


// we need to export this data in order to used in other JS file
//due to security purpose express does not allow to used JS file data into another JS file
module.exports = {books,author,publication};

