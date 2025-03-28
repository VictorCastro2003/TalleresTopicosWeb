const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.set('view engine','ejs');

function checkAuth(req,res,next){
    if(!req.cookies.username){
        return res.redirect('/login');
    }
    next();
}

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',(req,res)=>{
    const{username}=req.body;

    if(username){
        res.cookie('username',username,{maxAge:10*60*1000,httpOnly:true});
        res.cookie('theme','light',{maxAge:10*60*1000});
        return res.redirect('/profile');
    }
    res.send("El nombre de usuario es Obligatorio!!!!");
});

app.get('/profile',checkAuth,(req,res)=>{
    const username=req.cookies.username;
    const theme = req.cookies.theme||'light';
    res.render('profile',{username,theme});    
});

app.post('/profile',checkAuth,(req,res)=>{
    const {theme}=req.body;
    res.cookie('theme',theme,{maxAge:10*60*1000});
    res.redirect('/profile');
});

app.get('/logout',checkAuth,(req,res)=>{
    res.clearCookie('username');
    res.clearCookie('theme');
    res.redirect('/login');
});

app.get('/',(req,res)=>{
    if(req.cookies.username){
        return res.redirect('/profile');
    }
    res.redirect('/login');
});

app.listen(3000,()=>{
    console.log("El servidor funciona en http://localhost:3000");
});

