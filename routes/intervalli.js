// routes per prendere i dati relativi agli intervalli di tempo degli obiettivi

import { Router } from 'express';
import intervalliControllers from '../controllers/intervalliControllers.js';

const road = Router()


// get all intervalli
road.get('/', intervalliControllers.getAllIntervalli);    // GET all

//get by intervalli's id
road.get('/:id', intervalliControllers.getIntervalliById)  // GET id

//create new intervalli
road.post('/', intervalliControllers.createNewIntervalli)  // POST
 

// update specific intervall
road.patch('/:id', intervalliControllers.updateIntervalli)  //PATCH

//delete a specific intevall
road.delete('/:id', intervalliControllers.deleteIntervalli)  //DELETE

export default road