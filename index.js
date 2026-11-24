import express from 'express';
import usersRouter from './routes/users.js'
import goalsRouter from './routes/goals.js';
import intervalsRouter from './routes/intervals.js';
import intervalGoalsRouter from './routes/intervalGoals.js'
import errorHandler from './middleware/errorHandler.js'

var app = express();

app.use(express.json());


app.get('/', (req, res) =>{
   res.send('HIIII!')
})
app.use('/users', usersRouter);
app.use('/goals', goalsRouter);
app.use('/intervals', intervalsRouter);
app.use('/intervalGoals', intervalGoalsRouter);


app.use((req,res) =>{
    res.status(404).json({
        err: 'Route not found'
    })
})

app.use(errorHandler)

const port = process.env.PORT || 3000;




app.listen(port, () =>{
    console.log('Server da Nodejs ')
}); 






