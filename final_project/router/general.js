const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

  public_users.post("/register", (req, res) => {
    //public_users.post("/login", (req, res) => {    
      //Write your code here
      const username = req.body.username;
      const password = req.body.password;

      if (username && password) {
        if (!doesExist(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User " + username + " successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User " +username+ " already exists!"});    
        }
      } 
      return res.status(404).json({message: "Unable to register user."});
    });



    // Get the book list available in the shop
    public_users.get("/", function (req, res) {
          res.send(JSON.stringify({books},null,4));
    });

    public_users.get("/isbn/:isbn",function (req, res) {
        let isbnPromise = new Promise((resove,reject)=>{
            const isbn = req.params.isbn;
          });
          isbnPromise.then((result)=>{
            res.send(result);
          })
         });
    
      // Get book details based on author
      public_users.get("/author/:author", function (req, res) {
        let authorpromise = new Promise ((resolve,reject)=> {
            const author = req.params.author;
            let booksauthor = [];
            for (let i=0;i<Object.values(books).length;i++)
            {
              if (author === Object.values(books)[i].author)
              {
                booksauthor.push(Object.values(books)[i]);
              } 
            }
            resolve (booksauthor);
          });
          authorpromise.then((result)=>{
            if (result.length>0)
            {
              res.send(result);
            }
            else {
              res.status(404).json({message: "Author Not Found"});
            }
          });
        });

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    //Write your code here
 /*   const review = req.params.isbn;
    var filtered_book;
      let i = 1;
      while(books[i]){
          if (books[i]["isbn"]===review) {
              filtered_book = books[i];
              break;
          }
          i++;
      }
     res.send(filtered_book)
  });*/
  let ans = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              ans.push(books[key]);
          }
      }
  }
  if(ans.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(ans);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
    });

  // Task 10 
  // Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

  function getBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
    }

// Get all books – Using async callback function
function getAllBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 2000);

      return;
    });
  }

  // Search by ISBN – Using Promises
  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (!book) {
          reject("Book not found");
        }
        resolve(book);
      }, 2000);
    });
  }

  // Search by author – Using async callback function
  function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = [];
        for (const key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length === 0) {
          reject("Book not found");
        }
        resolve(booksByAuthor);
      }, 2000);
    });
  }

// Search by title – Using async callback function
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (const key in books) {
          if (books[key].title === title) {
            resolve(books[key]);
          }
        }
        reject("Book not found");
      }, 2000);
    });
  }

  module.exports.general = public_users;  