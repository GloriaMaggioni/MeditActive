import express from 'express';
// import db from './config/db.js';
import router from './routes/utents.js'

var app = express();

app.use(express.json());
app.use('/utents', router);


const port = 3000;


app.get('/', (req, res) =>{
   res.send('Ciaoooo!')
})


app.listen(port, () =>{
    console.log('Server da Nodejs ')
})

