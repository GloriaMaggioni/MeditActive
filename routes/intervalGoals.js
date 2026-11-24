//table where we put together goals and itervals

import { Router } from "express";
import intervalGoalsControllers from '../controllers/intervalGoalsControllers.js'

const intervalGoalsRouter = Router();


intervalGoalsRouter.get('/', intervalGoalsControllers.getAllDatas);   // GET

intervalGoalsRouter.post('/', intervalGoalsControllers.addNewDatas);  // POST

intervalGoalsRouter.patch('/:intervallo_id/:goal_id', intervalGoalsControllers.updateDatas);  // PATCH

export default intervalGoalsRouter