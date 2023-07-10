import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
.connect("mongodb://127.0.0.1:27017",{
    dbName : "backend",
})
.then(() => console.log("Database Connected"))
.catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
});
const User = mongoose.model("User", userSchema);
const app = express();
const users = [];
// app.get("/", (req, res)=>{
//     const pathlocation = path.resolve();
//     res.sendFile(path.join(pathlocation, "./index.html"));
// });

app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const isAuthenticated = async(req, res, next) => {


    const {token} = req.cookies;
    if(token){
        const decoded = jwt.verify(token, "dsdfefsfresdtdfreew");

        req.user = await User.findById(decoded._id);
        next();
    }
    else{
        res.redirect("/login");
    }
}
// app.get("/", (req, res)=>{
//     res.render("index", {name : "Abhi"});
// })

app.get("/", isAuthenticated, (req, res)=>{
    console.log(req.user)
    res.render("logout", {name :req.user.name});
   
})

app.get("/login", (req, res)=>{
    res.render("login");
})


app.get("/register", (req, res)=>{
    // console.log(req.user)
    res.render("register");
   
})

app.post("/login", async(req, res) => {

    const {email, password} = req.body;

    let user = await User.findOne({email});

    if(!user) return res.redirect("/register");

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.render("login", {email, message : "Incorrect Password"});

    const token = jwt.sign({_id : user._id}, "dsdfefsfresdtdfreew");

    res.cookie("token", token, {
        httpOnly : true, expires : new Date(Date.now() + 60*1000)
    });
    res.redirect("/");
})

app.post("/register", async(req, res)=>{
    console.log(req.body);
    const {name, email, password} = req.body;

    let user = await User.findOne({email});
    console.log(user)
    if(user){
        res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(password,10);
    user = await User.create({
        name,
        email,
        password : hashedPassword,
    });

    const token = jwt.sign({_id : user._id}, "dsdfefsfresdtdfreew");

    res.cookie("token", token, {
        httpOnly : true, expires : new Date(Date.now() + 60*1000)
    });
    res.redirect("/");
});


app.get("/logout", (req, res)=>{
    res.cookie("token", null, {
        expires : new Date(Date.now())
    });
    res.redirect("/");
});

// app.get("/success", (req, res)=>{
//     res.render("success");
// })

// app.get("/users", (req,res)=>{
//     res.json({
//         users,
//     })
// })

// app.get("/add", async(req, res)=>{
//     await Messge.create({ name : "Megha", email : "megha@hr.com"});
//     res.send("Nice");
// })

// app.post("/", async(req,res)=>{
//     await Messge.create({name : req.body.name, email : req.body.email});
//     // console.log(messageData);
//     res.redirect("/success");
//     // console.log(req.body)
// })
app.listen(5000,()=>{
    console.log("Server is Working............");
})

























































// const http = require("http");
// import http from "http";
// import gfName,{generateLovePercent} from "./features.js";
// import fs from "fs";
// console.log(gfName)
// console.log(generateLovePercent())

// const home = fs.readFileSync("./index.html")
// const server = http.createServer((req,res)=>{
//     if(req.url === '/'){
//         res.end(home)
//         }
//     else if(req.url === '/about'){
//     res.end(`<h1>Love is ${generateLovePercent()}</h1>`)
//     }
//     else if(req.url === '/contact'){
//         res.end("<h1>Contact Page</h1>")
//     }
//     else{
//         res.end("<h1>Page Not Found</h1>")
//     }
// })

// server.listen(5000, ()=>{
//     console.log("Server is Working")
// })