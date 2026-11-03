// logica relativa ai dati dei goals

import pool from "../config/db.js";


// method to get all goals
const getAllGoals = async (req,res) =>{
    try{
        const [rows] = await pool.execute('SELECT * FROM goals')
        res.status(200).json(rows);
         console.log(rows)

    }catch(err){
        res.status(500).json({
            err: 'Errore into query for the  goals',
        });
        console.log('Errore nella query in goalsControllers', err)

    }
} ;

 const getGoalsById = async (req, res) =>{
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
        console.log('Id del goals cercato:', rows[0])

    }catch(err){
        res.status(500).json({
            err: 'Error into query for the goals id'
        })
        console.log('Errore nelle query per id dei goals:', err)
    }

 }

 export default {getAllGoals, getGoalsById};