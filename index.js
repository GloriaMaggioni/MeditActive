import express from 'express';
import router from './routes/utents.js'
import rotta from './routes/goals.js';
import road from './routes/intervalli.js';
import rotte from './routes/tabellaPonte.js'
import errorHandler from './middleware/errorHandler.js'

var app = express();

app.use(express.json());


app.get('/', (req, res) =>{
   res.send('Ciaoooo!')
})
app.use('/utents', router);
app.use('/goals', rotta);
app.use('/intervalli', road);
app.use('/tabellaPonte', rotte);


app.use((req,res) =>{
    res.status(404).json({
        err: 'Route not found'
    })
})

app.use(errorHandler)

const port = 3000;




app.listen(port, () =>{
    console.log('Server da Nodejs ')
}); 






