const express = require('express');
const app = express();
const PORT= 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.post('/submit',(req,res)=>{
    res.redirect('/success.html');
});

app.listen(PORT,()=>{
    console.log('Servidor corriendo en el puerto 3000');

});