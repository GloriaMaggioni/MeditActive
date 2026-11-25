//table where we put together goals and itervals

import express from "express";
import intervalGoalsControllers from '../controllers/intervalGoalsControllers.js'

const intervalGoalsRouter = express.Router({mergeParams: true})

intervalGoalsRouter.get('/', intervalGoalsControllers.getIntervalGoal);   // GET

intervalGoalsRouter.post('/:id/goals', intervalGoalsControllers.addNewDatas);  // POST

intervalGoalsRouter.patch('/:intervallo_id/goals/:goal_id', intervalGoalsControllers.updateDatas);  // PATCH

export default intervalGoalsRouter