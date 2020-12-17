const mongoose = require("mongoose");
const Blog = require("./models/blog");
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

//creating blog
const blog = new Blog({
  title: "Test Blog",
  image:
    "https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80",
  body: "Hello this is a blog post",
});
blog.save();
