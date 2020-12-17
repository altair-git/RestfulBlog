const express = require("express");
const app = express();
const path = require("path");
const expresSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expresSanitizer());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//database connetion
mongoose
  .connect("mongodb://localhost:27017/Blogapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connetion open"))
  .catch((err) => {
    console.log("Mongo connection error");
    console.log(err);
  });

//restful route
//base route
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({});
  res.render("index", { blogs });
});

//create blog
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", async (req, res) => {
  req.body.body = req.sanitize(req.body.body);
  const newBlog = new Blog(req.body);
  await newBlog.save();
  res.redirect("/");
});

//show details
app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const foundBlog = await Blog.findById(id);
  res.render("show", { foundBlog });
});

//edit

app.get("/blogs/:id/edit", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  res.render("edit", { blog });
});

//update route
app.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  req.body.body = req.sanitize(req.body.body);
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/blogs/${id}`);
});

//delete route

app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.redirect("/");
});
//listening port
app.listen(3000, () => {
  console.log("Server  started");
});
