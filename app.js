var express= require("express");
var mongoose= require("mongoose");
var bodyparser= require("body-parser");
var methodOverride= require("method-override");
var app= express();
var expressSanitizer= require("express-sanitizer");





mongoose.connect("mongodb+srv://blogger:blogger@cluster0.mh7xv.mongodb.net/bloggers?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type: Date,default:Date.now}
});
var Blog= mongoose.model("Blog",blogSchema);

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
			console.log(err);
		else
			res.render("index",{blogs:blogs});
	});

});
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
	Blog.create(req.body.blog,function(err,newBlog){
			if(err)
				res.render("new");
			else
				res.redirect("/blogs");
	});
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundblog){
		if(err)
			res.render("/blogs");
		else
			res.render("show",{blog:foundblog});
	});
});

app.get("/blogs/:id/edit",function(req,res){

	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			res.render("/blogs");
		else
			res.render("edit",{blog:foundBlog});
	});
});

app.put("/blogs/:id",function(req,res){
	
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs/"+req.params.id);
	});
});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs");
	});
});




//var port = process.env.Port || 3000;


app.listen(process.env.PORT,process.env.IP,function(){
	console.log("server to blogapp connected");
});
