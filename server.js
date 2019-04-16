var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;
var myParser = require("body-parser");
var errorHandler = require('errorhandler')
var cookieParser = require('cookie-parser')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

app.use(express.static("public"));
 
app.set("view engine", "ejs");
app.set("views", "./views");
 
app.use(myParser.urlencoded({extended : true}));
app.use(myParser.json());

app.use(errorHandler({ dumpExceptions: true, showStack: true }));

app.use(cookieParser());

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/todolist',
  collection: 'mySessions'
});

app.use(session({
  secret: "some private string",
  name: "user",
  store: store,
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

var url = "mongodb://localhost:27017/";

/** Middleware for limited access */
  function requireLogin (req, res, next) {
  if (req.session.username) {
    // User is authenticated, let him in

    next();
  } else {
    // Otherwise, we redirect him to login form
    res.redirect("login");
  }
  }


  app.listen(3000, function () {
    console.log('todolist app listening on port 3000!');
  });
   
  app.get("/", [requireLogin],function(request, response)  {
    
    response.render("index");
});
 
  app.get("/Add",[requireLogin], function(request, response)  {
    
    response.render("Addtask");
});

  app.get('/GetAll',[requireLogin], function (req, response) {
      
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("todolist");
        var query;
        if (req.session.stat =="admin") {
          query = { };
        }else{
          query = { username: req.session.username };
        }
       dbo.collection("tasks").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        result.push({status: req.session.stat});
        response.send(result);
         db.close();
      });
      });
  })

  app.post('/AddTask' , function (request ,response){
      
    console.log("you enter on the post add task method");
    console.log(request.body)

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("todolist");
        request.body.username = request.session.username;
        dbo.collection("tasks").insertOne(request.body, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          response.sendStatus(200)
          db.close();
        });
        
      });
  });

  app.post('/DeleteTask', function (request ,response){
    console.log("you enter on the DELETE  task method");
    console.log(request.body);

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("todolist");
        dbo.collection("tasks").deleteOne(request.body, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          response.sendStatus(200)
          db.close();
        });
      });
  })

  app.post('/UpdateTask', function (request ,response){
    console.log("you enter on the Update  task method");
    console.log(request.body);

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("todolist");
    var newvalues = { $set: {finished: request.body.status} };
    var myquery = { Start: request.body.Start };
    dbo.collection("tasks").update(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.sendStatus(200)
      db.close();
      });
    });
  })

// method to find users
 
  app.get("/login", function (req, res) {
  // Show form, default value = current username
   res.render("login", { "username": null, "pwd":null, "error": null });
  });

  app.post("/login", function (req, res) {
  var options = { "username": req.body.username, "pwd": req.body.pwd,"error": null };
  if (!req.body.username) {
    options.error = "User name is required";
    res.render("login", options);
  } else if (req.body.username == req.session.username) {
    // User has not changed username, accept it as-is
    res.redirect("/");
  } else if (!req.body.username.match(/^[a-zA-Z0-9\-_]{3,}$/)) {
    options.error = "User name must have at least 3 alphanumeric characters";
    res.render("login", options);
  } else {
    // Validate if username is free
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("todolist");
      var query = { username: req.body.username };
      dbo.collection("users").find(query).toArray(function(err, result) {
        if (err) throw err;

        if(result.length == 0) //if it does add it 
        {
          console.log("Not in docs");

          var myobj = { username: req.body.username, password: req.body.pwd ,status:"user" };

          dbo.collection("users").insertOne(myobj, function(err, resp) {
            if (err) throw err;
          console.log("1 document inserted");
          res.redirect("signin");
        });

        }
        else  // if it does not 
        {
            console.log(" alreday exist on the database :" +result[0].username);
            options.error = "The username already exist ";
            res.render("login", options);
        }
        db.close();
      });
    });
  }
  });


  app.get("/signin", function (req, res) {
  // Show form, default value = current username
   res.render("signin", { "username": req.session.username, "pwd":req.session.pwd, "error": null });
   });

  app.post("/signin", function (req, res) {
  var options = { "username": req.body.username, "pwd": req.body.pwd,"error": null };
  if (!req.body.username) {
    options.error = "User name is required";
    res.render("signin", options);
  } 
  else if(!req.body.pwd ){
    options.error = "password is required";
    res.render("signin", options);
  }
  else if (req.body.username == req.session.username) {
    // User has not changed username, accept it as-is
    res.redirect("/");
  } else if (!req.body.username.match(/^[a-zA-Z0-9\-_]{3,}$/)) {
    options.error = "User name must have at least 3 alphanumeric characters";
    res.render("signin", options);
  } else {

    // Validate if username is free
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("todolist");
      var query = { username: req.body.username ,password:req.body.pwd};
      dbo.collection("users").find(query).toArray(function(err, result) {
        if (err) throw err;

        if(result.length == 0) //if it does add it 
        {
          options.error = "The username/password is incorrect ";
          res.render("signin", options);
          
        }
        else  // if it does not 
        {
            console.log(" connextion good exist on the database :" +result[0].username);

            req.session.username = result[0].username;
            req.session.stat = result[0].status;
            res.redirect("/");  
          }
        db.close();
      });
    });
  }
  });

  app.get('/logout',(req,res) => {
    console.log("you enter in the logout");
    req.session.destroy(function(err) {
        if(err) {
             console.log(err);
        }
        console.log("you enter in the logout");
        res.redirect('/');
         });
         
    });

  app.use(function(req, res, next){
   res.setHeader('Content-Type', 'text/plain');
   res.status(404).send('Page Not Found !');
  });
