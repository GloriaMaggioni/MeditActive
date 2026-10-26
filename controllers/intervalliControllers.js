// logica relativa ai dati deli intervalli dei goals

import pool from "../config/db.js"


// method to take all of intervalli
 const getAllIntervalli = async (req,res) =>{
    try{
        const [rows] = await pool.execute('SELECT * FROM intervalli');
        res.status(200).json(rows);
        console.log('risultato delle get att senza filtri', rows)

    }catch(err){
        res.status(500).json({
            err: 'Error during the query to take the list of intervalli',
        })
    }
 }   // GET --> da aggiungere poi i filtri

 const getIntervalliById = async (req,res) =>{
    try{
        const intervalloId = req.params.id;
        const [rows] = await pool.execute('SELECT * FROM intervalli WHERE id = ?', [intervalloId]);

        if(rows.length === 0){
            res.status(404).json({
                err: 'Inteval not found'
            })
            return;
        }

        res.status(200).json(rows[0]);
         console.log('Id dell intervallo scelto', rows[0])


    }catch(err){
        res.status(500).json({
            err: 'Errore during the query for the intervals id'
        })

    }
 }   //GET ID


 // method to creare a new intervallo
 const createNewIntervalli = async (req,res) =>{
    try{
        const {data_inizio, data_fine,utent_id} = req.body;

        if(!data_inizio || !data_fine || !utent_id){
            res.status(400).json({
                error: "Insert correct datas"
            })
        }else{
            const [newIntervallo] = await pool.execute('INSERT INTO intervalli (data_inizio,data_fine, utent_id) VALUES (?,?,?) ', [data_inizio, data_fine, utent_id]);
            console.log('Nuovo Intervallo', newIntervallo);
            res.status(201).json({
                id: newIntervallo.insertId,
                data_inizio: data_inizio,
                data_fine : data_fine,
                utent_id: utent_id
            })
        }

    }catch(err){
        res.status(500).json({
            err: 'Error into the POST query for create a new interval'
        })
    }
 }   // POST

 const updateIntervalli = async (req,res) =>{ }  //PATCH

 const deleteIntervalli = async (req,res) =>{
    try{
        const intervalloId = req.params.id;
        const [result] = await pool.execute('DELETE  FROM intervalli WHERE id =?', [intervalloId]);
        
        if(result.affectedRows === 0){
            res.status(404).json({
                err : 'Error during the elimination of the interval'
            })
          
        }else {  
            res.status(200).json({
              message: 'Interval eliminated succeffully'
            })
        }
    } catch(err){
        res.status(500).json({
            err: 'Error during the elimination of the interval selected'
        })
    }
 } // DELETE



export default  {getAllIntervalli,createNewIntervalli, getIntervalliById, updateIntervalli, deleteIntervalli};