// logica relativa ai dati dei goals

import pool from "../config/db.js";
import checkId from "../utils/checkId.js";


// method to get all goals
const getAllGoals = async (req,res, next) =>{    // GET
    try{
        const [rows] = await pool.execute('SELECT * FROM goals')
        res.status(200).json(rows);
    }catch(err){
       next(err)
    }
} ;

 
const getGoalsById = async (req, res, next) =>{          // GET ID
    try{
        const goalsId = req.params.id;
        const controlId = checkId(goalsId)
     

        if(controlId){
            return next(controlId);
        }
        const [rows] = await pool.execute('SELECT * FROM goals WHERE id = ?', [goalsId]);
        console.log(rows)

        if(rows.length === 0){
            res.status(404).json({
                err: 'Goals not found'
            });
            return;
        }

        res.status(200).json(rows[0]);

    }catch(err){
        next(err)
    }

 }

 export default {getAllGoals, getGoalsById};