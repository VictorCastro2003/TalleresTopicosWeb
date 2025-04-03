const express = require("express");
const session = require("express-session");
const path = require("path");


const app = express();

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie:{maxAge: 60000},
    })
);

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.post("/login", (req,res)=>{
    const {usuario} = req.body;
    if(usuario){
        req.session.usuario = usuario;
        res.redirect("/dashboard");
    }else{
        res.send("por favor introduce nombre de usuario");
    }
});

app.get("/dashboard", (req,res)=>{
    if (req.session.usuario) {
        res.send(`
            <h1> BIENVENIDO, ${req.session.usuario}</h1>
            <a href='/logout'>Cerrar sesión</a>
        `);
        
    }else{
        res.redirect("/");
    }
});

app.get("/logout", (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });
});

app.listen(3000, ()=>console.log("Servidor corriendo en http://localhost:3000"));