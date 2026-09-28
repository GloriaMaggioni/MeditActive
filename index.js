import express, { json } from 'express';
import db from './config/db.js'

var app = express();
app.use(json());

const port = 3000;


app.get('/', (req, res) =>{
   res.send('Ciaoooo!')
})


app.listen(port, () =>{
    console.log('Server da Nodejs ')
})


// //chiude la connessione al db(altrimenti rimane sempre aperta)
// process.on('SIGINT', () =>{
//     connection.end(() =>{
//         console.log('Connessione al db chiusa');
//         process.exit(0)
//     })
// })