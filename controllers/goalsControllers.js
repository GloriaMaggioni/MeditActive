// logica relativa ai dati dei goals

import pool from "../config/db.js";


// method to get all goals
const getAllGoals = async (req,res, next) =>{
    try{
        const [rows] = await pool.execute('SELECT * FROM goals')
        res.status(200).json(rows);
    }catch(err){
       next(err)
    }
} ;

 const getGoalsById = async (req, res, next) =>{
    try{
        const goalsId = req.params.id;
        const [rows] = await pool.execute('SELECT * FROM goals WHERE id = ?', [goalsId]);

        if(rows.length === 0){
            res.status(404).json({
                error: 'Goals not found'
            });
            return;
        }

        res.status(200).json(rows[0]);

    }catch(err){
        next(err)
    }

 }

 export default {getAllGoals, getGoalsById};