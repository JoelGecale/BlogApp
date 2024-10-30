import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var posts = []; //title, author, date, body

function saveNewPost(postDetails){
    const d = new Date();
    const post= {title: postDetails.title, author: postDetails.author, content: postDetails.content, date: d.toDateString()};
    posts.push(post);
}

function getItem(clickedbutton){
    return (Number(clickedbutton.substring(1,clickedbutton.length)));
}

function updatePost(postDetails){
    var i = getItem(postDetails.submit)
    posts[i].title = postDetails.title;
    posts[i].author = postDetails.author;
    posts[i].content = postDetails.content;  
}

function deletePost(index){    
    for(i=index; i<posts.length-1; i++){
        console.log(i);
        console.log(posts[i]);
        console.log(i+1);
        posts[i].title = posts[i+1].title;
        posts[i].author = posts[i+1].author;
        posts[i].content = posts[i+1].content; 
        posts[i].date = posts[i+1].date; 
        console.log(posts[i]);
    }
    posts.pop();
}

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs", {posts});
});

app.post("/detail", (req, res) => {
    var post = posts[getItem(req.body.submit)];
    post.type = req.body.submit;

    if(req.body.submit[0] === "v"){
        res.render("view-post.ejs", {post});
    }
    else {
        res.render("post-detail.ejs", {post});
    }
});

app.get("/new-post", (req, res) => {
    res.render("post-detail.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/submit", (req, res) =>{
    if(req.body.submit === "n"){
        saveNewPost(req.body); 
        res.render("submit.ejs",{message: "The new post has been saved!"});   
    }
    else if(req.body.submit[0] === "u"){
        updatePost(req.body);
        res.render("submit.ejs",{message: "The post has been updated!"}); 
    }
    else if(req.body.submit[0] === "d"){
        deletePost(getItem(req.body.submit));
        res.render("submit.ejs",{message: "The post has been deleted!"});  
    }
    else {
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})