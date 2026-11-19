// logica relativa ai dati deli intervalli dei goals

import pool from "../config/db.js"


// method to take all of intervalli    // GET 
 const getAllIntervalli = async (req,res, next) =>{
    try{
        const {goal_id, data_inizio, data_fine} = req.query;
        const conditions = [];
        const values= [];

             if(goal_id ){
                conditions.push('tabellaPonte.goal_id =?');
                values.push(goal_id)
             }
             if(data_inizio){
                conditions.push('intervalli.data_inizio >=?');
                values.push(data_inizio)
             }
             if(data_fine ){
                conditions.push('intervalli.data_fine <=?');
                values.push(data_fine)
             };

             let query = `
               SELECT intervalli.id, tabellaPonte.goal_id, intervalli.data_inizio, intervalli.data_fine,  intervalli.utent_id
               FROM intervalli
               LEFT JOIN tabellaPonte ON intervalli.id = tabellaPonte.intervallo_id 
             `;

             if(conditions.length > 0){
                query += ` WHERE ${conditions.join(' AND ')}`
              }

         const [rows] = await pool.execute(query, values);
         

         const result = [];

         rows.forEach(item =>{
           let trovato =  result.find( intervallo =>{ 
                return intervallo.id === item.id    
           });

             // per intervalli
            if(trovato === undefined){
                    trovato = {
                        id: item.id,
                        dataInizio: item.data_inizio,
                        dataFine: item.data_fine,
                        utenteId : item.utent_id,
                        goals: [],
                    }
                    result.push(trovato)
             };
            
             //x goals
            if(item.goal_id !== null){
                trovato.goals.push(item.goal_id)
             }
         })
         res.status(200).json(result);

    }catch(err){
       next(err)
    }
 } ; 


 //GET ID
 const getIntervalliById = async (req,res, next) =>{
    try{
        const intervalloId = req.params.id;
        const [rows] = await pool.execute('SELECT * FROM intervalli WHERE id = ?', [intervalloId]);

        if(rows.length === 0){
            res.status(404).json({
                err: 'Interval not found'
            })
            return;
        }

        res.status(200).json(rows[0]);
    }catch(err){
       next(err);
    }
 };   


 // method to creare a new intervallo     // POST
 const createNewIntervalli = async (req,res) =>{
    try{
        const {data_inizio, data_fine,utent_id} = req.body;

        if(!data_inizio || !data_fine || !utent_id){
            res.status(400).json({
                err: "Insert correct datas"
            })
        }else{
            const [newIntervallo] = await pool.execute('INSERT INTO intervalli (data_inizio,data_fine, utent_id) VALUES (?,?,?) ', [data_inizio, data_fine, utent_id]);
            res.status(201).json({
                id: newIntervallo.insertId,
                data_inizio: data_inizio,
                data_fine : data_fine,
                utent_id: utent_id
            })
        }

    }catch(err){
       next(err);
    }
 };

  //PATCH
 const updateIntervalli = async (req,res, next) =>{
    try{
        const {data_inizio, data_fine} = req.body;
        const {id} = req.params;

        if(!data_inizio || !data_fine){
             res.status(400).json({
                err: "Datas not correct: insert data of beginning and data of ending"
            })
            
        }else if( data_fine < data_inizio ){
            res.status(400).json({
                err: 'Insert valid datas: date not valid.The end date must be later than the end date'
            })
            
        }else{
            const [result] = await pool.execute('UPDATE intervalli SET data_inizio =?, data_fine =? WHERE id= ?', [data_inizio,data_fine, id]);

           if(result.affectedRows === 0){
                res.status(404).json({
                    err: 'Data not found'
                })
            }else{
                res.status(200).json({
                   message:  'Update complete successfully'
                })
            }
        }
    }catch(err){
        next(err)
    }
  } ;

 // DELETE
 const deleteIntervalli = async (req,res, next) =>{
    try{
        const intervalloId = req.params.id;
        const [result] = await pool.execute('DELETE  FROM intervalli WHERE id =?', [intervalloId]);
        
        if(result.affectedRows === 0){
            res.status(404).json({
                err : 'Id interval not found'
            })
          
        }else {  
            res.status(200).json({
              message: 'Interval eliminated succeffully'
            })
        }
    } catch(err){
        if (err.code === 'ER_ROW_IS_REFERENCED_2'){
            res.status(409).json({
                err: 'Cannot delete this interval: it has linked goals'
            })
        }else {
             res.status(500).json({
            err: 'Error during the elimination of the interval selected'
        })
        }
       
    }
 } ;



export default  {getAllIntervalli,createNewIntervalli, getIntervalliById, updateIntervalli, deleteIntervalli};





