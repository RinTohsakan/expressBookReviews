const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

  const authenticatedUser = (username,password)=>{ 
    if (isValid){
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
  }

  regd_users.post("/login", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
    // }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', {expiresIn: 60 * 60});
  
      req.session.authorization = {
        accessToken,username
      }
      return res.status(200).json({message: "User successfully logged in"});
    }
    else
    {
      res.status(404).json({message: "Can't Login"})
    }
  });


  regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = Object.keys(books)
    let bookreview = books[isbn];
    if (bookreview)
    {
    let review = req.query.review;
    let username = req.session.authorization.username;
    if (review){
      bookreview.reviews[username]=review;
    }
    books[isbn]=bookreview;
    res.status(200).json({message:"Book review added/updated"});
    }
    else {
      res.send("Error");
    }
  
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const author = req.params.isbn;
    let bookreviewdel = books[isbn];
    let username=req.session.authorization.username;
    if (bookreviewdel)
    {
       delete bookreviewdel.reviews[username];
       res.send("Book Review Deleted");
    }
    else 
    {
      res.send("Error");
    }
  });
  
module.exports.authenticated = regd_users;
  

module.exports.isValid = isValid;
module.exports.users = users;