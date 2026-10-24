// routes per prendere i dati relativi agli intervalli di tempo degli obiettivi

import { Router } from 'express';
import intervalliControllers from '../controllers/intervalliControllers.js';

const road = Router()


// get all intervalli
road.get('/', intervalliControllers.getAllIntervalli);

//create new intervalli
road.post('/', intervalliControllers.createNewIntervalli)
 

// update specific intervall
road.patch('/:id', intervalliControllers.updateIntervalli)

//delete a specific intevall
road.delete('/:id', intervalliControllers.deleteIntervalli)

export default road