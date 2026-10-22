// routes per prendere i dati relativi agli obiettivi
import { Router } from 'express'
 import goalsController from '../controllers/goalsController.js'

 const router = Router();


 router.get('/', goalsController.getAllGoals())

export default router