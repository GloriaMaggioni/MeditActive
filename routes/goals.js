// routes per prendere i dati relativi agli obiettivi

const express = require('express');
const router = express.Router()
const goalsControllers = require('../controllers/goalsControllers.js')

router.get('/', goalsControllers.getAllGoals())

module.exports = router