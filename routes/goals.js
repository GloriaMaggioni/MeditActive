// routes to take datas about the goals
import { Router } from 'express'
 import goalsControllers from '../controllers/goalsControllers.js'

 const goalsRouter = Router();


goalsRouter.get('/', goalsControllers.getAllGoals);    //  GET

  
goalsRouter.get('/:id', goalsControllers.getGoalsById);   // GET ID

export default goalsRouter