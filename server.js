var express = require("express");
var app = express();
 
app.use(express.static("public"));
 
app.set("view engine", "ejs");
app.set("views", "./views");
 
app.listen(3000, function () {
    console.log('todolist app listening on port 3000!');
  });
   
app.get("/", function(request, response)  {
    
    response.render("index");
});
 
app.get("/Add", function(request, response)  {
    
    response.render("Addtask");
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/GetAll', function (req, response) {

  
    
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("todolist");
    dbo.collection("tasks").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        response.send(result);
         db.close();
      });
      });
  })

  var myParser = require("body-parser");
  app.use(myParser.urlencoded({extended : true}));
  app.use(myParser.json());

  app.post('/AddTask' , function (request ,response){
      
    console.log("you enter on the post add task method");
    console.log(request.body)

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("todolist");
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