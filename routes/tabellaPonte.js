import { Router } from "express";
import tabellaPonteControllers from '../controllers/tabellaPonteControllers.js'

const rotte = Router();


rotte.get('/', tabellaPonteControllers.getAllDatas)

export default rotte