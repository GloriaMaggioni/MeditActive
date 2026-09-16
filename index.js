var express = require('express');
require('./config/db')

var app = express();
app.use(express.json());

const port = 3000;


app.get('/', (req, res) =>{
   res.send('Ciaoooo!')
})


app.listen(port, () =>{
    console.log('Server da Nodejs ')
})