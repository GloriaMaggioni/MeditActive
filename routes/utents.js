// routes per prendere i dati degli utenti


//SOLO ROUTES NON LOGICA

import { Router } from 'express';
const router = Router()
import { getAllUtents } from '../controllers/utentsControllers.js';


router.get('/', getAllUtents);
//getAllUtents metodo da creare in utentsController per prendere i dati degli utenti

export default router