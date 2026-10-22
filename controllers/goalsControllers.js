// logica relativa ai dati dei goals

import pool from "../config/db.js";


// method to get all goals
const getAllGoals = async (req,res) =>{
    try{
        const [rows] = await pool.execute('SELECT * FROM goals')
        res.json(rows);
        console.log(rows)

    }catch(error){
        res.status(500).json({
            err: 'Errore nella query per i goals',
        });
        console.log('Errore nella query in goalsControllers', error)

    }
};

export default getAllGoals;