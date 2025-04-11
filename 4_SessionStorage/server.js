const express= require('express');
const app = express();
const port= 1234;

app.use(express.static('views'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/index.html');
});

app.listen(port,()=>{
    console.log(`server funcionando en http://localhost:${1234} `);
});
