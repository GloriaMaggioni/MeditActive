// routes per prendere i dati relativi agli obiettivi

import { Router } from 'express';
const router = Router()
import { getAllGoals } from '../controllers/goalsControllers.js';

router.get('/', getAllGoals())

export default router