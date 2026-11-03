import express from 'express';
import router from './routes/utents.js'
import rotta from './routes/goals.js';
import road from './routes/intervalli.js';
import rotte from './routes/tabellaPonte.js'

var app = express();

app.use(express.json());
app.use('/utents', router);
app.use('/goals', rotta);
app.use('/intervalli', road)
app.use('/tabellaPonte', rotte)

const port = 3000;


app.get('/', (req, res) =>{
   res.send('Ciaoooo!')
})


app.listen(port, () =>{
    console.log('Server da Nodejs ')
})

