//table where we put together goals and itervals

import express from "express";
import intervalGoalsControllers from '../controllers/intervalGoalsControllers.js'

const intervalGoalsRouter = express.Router({mergeParams: true})

intervalGoalsRouter.get('/', intervalGoalsControllers.getIntervalGoal);   // GET

intervalGoalsRouter.post('/:id/goals', intervalGoalsControllers.addGoalToInterval);  // POST

intervalGoalsRouter.patch('/:intervallo_id/goals/:goal_id', intervalGoalsControllers.updateData);  // PATCH

export default intervalGoalsRouter