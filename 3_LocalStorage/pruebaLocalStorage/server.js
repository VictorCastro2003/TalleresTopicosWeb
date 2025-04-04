const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('views'));
app.listen(3000, ()=>{
    console.log('Servidor corriendo en http://localhost:3000');
});