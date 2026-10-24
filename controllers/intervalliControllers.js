// logica relativa ai dati deli intervalli dei goals

import pool from "../config/db.js"



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

 const getIntervalliById = async (req,res) =>{}   //GET ID

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

 const deleteIntervalli = async (req,res) =>{} // DELETE



export default  {getAllIntervalli,createNewIntervalli, getIntervalliById, updateIntervalli, deleteIntervalli};