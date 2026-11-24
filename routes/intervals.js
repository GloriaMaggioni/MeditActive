// routes to take datas about time intervals while you follow the goals

import { Router } from 'express';
import intervalsControllers from '../controllers/intervalsControllers.js';

const intervalsRouter = Router()


// get all intervals
intervalsRouter.get('/', intervalsControllers.getAllIntervals);    // GET all

//get by intervals'  id
intervalsRouter.get('/:id', intervalsControllers.getIntervalsById)  // GET id

//create new intervals
intervalsRouter.post('/', intervalsControllers.createNewInterval)  // POST
 

// update specific interval
intervalsRouter.patch('/:id', intervalsControllers.updateIntervals)  //PATCH

//delete a specific inteval
intervalsRouter.delete('/:id', intervalsControllers.deleteIntervals)  //DELETE

export default intervalsRouter