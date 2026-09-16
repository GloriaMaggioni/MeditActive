// routes per prendere i dati degli utenti


//SOLO ROUTES NON LOGICA

const express = require('express');
const router = express.Router()
const utentiControllers = require('../controllers/utentsControllers.js')


router.get('/', utentiControllers.getAllUtents);
//getAllUtents metodo da creare in utentsController per prendere i dati degli utenti

module.exports = router