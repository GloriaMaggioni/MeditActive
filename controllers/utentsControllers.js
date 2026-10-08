// logica relativa ai dati utenti

import pool from '../config/db.js'
//obj : prendere i dati degli utento



 const  getAllUtents = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM utents')
        res.json(rows);
        console.log(rows)
        
    }catch(err){
        res.status(500).json({
            err: 'Errore nella query',    
        });
        console.log('Errore nella query in utentsControllers', err)
        
    }
    
}


const getUtentId = async  (req,res) =>{
    try{
        const utentId = req.params.id;
        const [rows] = await pool.query( 'SELECT * FROM utents WHERE id = ? ', [utentId]);

        if (rows.length === 0){
            // persona non esiste,cosa fare
            res.status(404).json({
                error: 'Utent not found'
            })
            return;
        }
             res.json(rows)
            console.log('Id dell utente scelto', rows[0])
        
        
    }catch(error){
        res.status(500).json({
            error: 'Errore nella query per id ',
        })
    }
}

export default {getAllUtents, getUtentId}