// routes per prendere i dati degli utenti


//SOLO ROUTES NON LOGICA

import { Router } from 'express';
import utentsControllers from '../controllers/utentsControllers.js';

 const router = Router()

// router.get(percorso,funzione)
router.get('/', utentsControllers.getAllUtents);
//getAllUtents metodo da creare in utentsController per prendere i dati degli utenti
router.get('/:id', utentsControllers.getUtentId)

export default router