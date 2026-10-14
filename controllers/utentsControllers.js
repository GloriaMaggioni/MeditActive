// logica relativa ai dati utenti

import pool from '../config/db.js'
//obj : prendere i dati degli utento


// method to get all utents
 const  getAllUtents = async (req, res) =>{
    try{
        const [rows] = await pool.execute('SELECT * FROM utents')
        res.json(rows);
        console.log(rows)
        
    }catch(err){
        res.status(500).json({
            err: 'Errore nella query',    
        });
        console.log('Errore nella query in utentsControllers', err)
        
    }
    
};

// method to get the specifi utents's ID
const getUtentId = async  (req,res) =>{
    try{
        const utentId = req.params.id;
        const [rows] = await pool.execute( 'SELECT * FROM utents WHERE id = ? ', [utentId]);

        if (rows.length === 0){
            // persona non esiste,cosa fare
            res.status(404).json({
                error: 'Utent not found'
            })
            return;
        }
             res.json(rows[0])
             console.log('Id dell utente scelto', rows[0])
        
        
    }catch(error){
        res.status(500).json({
            error: 'Errore nella query per id ',
        })
        console.log('Errore nel cercare id',error)
    }
};


// method to create new utent on the db
const addNewUtent = async (req, res) =>{
    
    try{
        const {name,surname,email} = req.body
        if(!name || !surname || !email){
            res.status(400).json({
                message: 'Inserire dati in modo corretto'
            })
            return;
        }else{
        const [newUtent] = await pool.execute('INSERT INTO utents (name,surname,email) VALUES (?,?,?)', [name,surname,email]);
        console.log('Nuovo utente:', newUtent)
        res.status(201).json({
           id : newUtent.insertId,
           name: name,
           surname: surname,
           email:email
        })
        }
    }catch(error){
        res.status(500).json({
            error: 'Utent not valid'
        })
        console.log('Errore nella creazione del nuovo utente',error)
    }
};


// delete an utent method

const deleteUtent = async (req, res) =>{
    try{
         const utentId = req.params.id;
         const [result] = await pool.execute('DELETE FROM utents WHERE id=?', [utentId])

        if(result.affectedRows === 0){
            res.status(404).json({
                message : 'Utent not found'
            })
        }else{
               res.status(200).json({
                message: 'Utente eliminato',
               id: utentId
            })
        }

    }catch(error){
        res.status(500).json({
             error : 'Errore durante la cancellazione'

        })
    }
};



// method for update the utent
  // PUT
const utentUpdate = async(req, res) =>{
    try{
        if(!name || !surname || !email){
            res.status(400).json({
                error: 'Incompleted datas'
            })
            return;
        }
        const id = req.params.id;
        const {name,surname,email} = req.body;
        const [result] = await pool.execute('UPDATE utents SET name = ?, surname =?, email=? WHERE id =? ', [name,surname,email, id]);

         if(result.affectedRows === 0){
             res.status(404).json({
                error: 'Upload did not take place'
             })
         }else{
             res.status(200).json({
              message: 'Utent updated',
              id : id
          })

         }

    }catch(error){
        res.status(500).json({
            error: 'Upload not allowed with success!'
        })

    }

}

  // PATCH
const updateUtentPatch = (req, res) =>{}




export default {getAllUtents, getUtentId, addNewUtent, deleteUtent, utentUpdate, updateUtentPatch}