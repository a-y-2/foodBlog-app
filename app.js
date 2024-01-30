  var bodyParser = require("body-parser"),
 methodOverride = require("method-override"),
 express        = require("express"),
 expressSanitizer= require("express-sanitizer"),
 app            = express();

 const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/blogapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//     title: "test",
//     image: "https://images.pexels.com/photos/2147029/pexels-photo-2147029.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     boby: "hello"
// });

 //RESTFUL ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res) {
    Blog.find({}, function(err,blogs){//whatever comes back from db,it comes under the name blogs
        if(err){
            console.log("error");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
    //create blog
    console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body);
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});//foundBlog is passed to show under the name of blog
        }
    });
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});//foundBlog is passed to show under the name of blog
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    //DESTROY BOLG AND THEN REDIRECT SOMEWHERE
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});



app.listen(3000,function(){
    console.log("serving");
});  
