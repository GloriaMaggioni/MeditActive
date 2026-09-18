// routes per prendere i dati relativi agli intervalli di tempo degli obiettivi

const express = require('express');
const router = express.Router()
const intervalliControllers = require('../controllers/intervalliControllers.js')

router.get('/', intervalliControllers.getAllIntervalli());

module.exports = router