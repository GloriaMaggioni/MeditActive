import { Router } from "express";
import tabellaPonteControllers from '../controllers/tabellaPonteControllers.js'

const rotte = Router();


rotte.get('/', tabellaPonteControllers.getAllDatas);   // GET

rotte.post('/', tabellaPonteControllers.addNewDatas);  // POST

rotte.patch('/:intervallo_id/:goal_id', tabellaPonteControllers.updateDatas);  // PATCH

export default rotte