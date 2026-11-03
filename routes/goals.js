// routes per prendere i dati relativi agli obiettivi
import { Router } from 'express'
 import goalsControllers from '../controllers/goalsControllers.js'

 const rotta = Router();


 rotta.get('/', goalsControllers.getAllGoals)

  rotta.get('/:id', goalsControllers.getGoalsById)

export default rotta