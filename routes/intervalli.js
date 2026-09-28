// routes per prendere i dati relativi agli intervalli di tempo degli obiettivi

import { Router } from 'express';
import { getAllIntervalli } from '../controllers/intervalliControllers.js';

const router = Router()

router.get('/', getAllIntervalli());

export default router