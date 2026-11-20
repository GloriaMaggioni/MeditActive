// logica relativa ai dati users

import pool from '../config/db.js'



// method to get all users
 const  getAllUsers = async (req, res, next) =>{
    try{
        const [rows] = await pool.execute('SELECT * FROM users')
        res.json(rows);        
    }catch(err){
       next(err) ;
    }
    
};

// method to get the specifi users's ID
const getUserId = async  (req,res,next) =>{
    try{
        const userId = req.params.id;
        const [rows] = await pool.execute( 'SELECT * FROM users WHERE id = ? ', [userId]);

        if (rows.length === 0){
            res.status(404).json({
                error: 'User not found'
            })
            return;
        }
             res.json(rows[0]);    
        
    }catch(err){
       next(err)
    }
};


// method to create new user on the db  POST
const addNewUser = async (req, res, next) =>{
    
    try{
        const {name,surname,email} = req.body;

        if(!name || !surname || !email){
            res.status(400).json({
                message: 'Enter datas correncly. Enter name,surname and email'
            })
            return;
        }else{
        const [newUser] = await pool.execute('INSERT INTO users (name,surname,email) VALUES (?,?,?)', [name,surname,email]);
        res.status(201).json({
           id : newUser.insertId,
           name: name,
           surname: surname,
           email:email
        })
        }
    }catch(err){
       next(err)
    }
};


// delete an user method

const deleteUser = async (req, res,next) =>{
    try{
         const userId = req.params.id;
         const [result] = await pool.execute('DELETE FROM users WHERE id=?', [userId])

        if(result.affectedRows === 0){
            res.status(404).json({
                message : 'User not found'
            })
        }else{
               res.status(200).json({
                message: 'User eliminated',
               id: userId
            })
        }

    }catch(err){
      next(err);
    }
};



// method for update the user
  // PUT
const userUpdate = async(req, res,next) =>{
    try{
         const id = req.params.id;
        const {name,surname,email} = req.body;

        if(!name || !surname || !email){
            res.status(400).json({
                error: 'Incompleted datas'
            })
            return;
        }
       
        const [result] = await pool.execute('UPDATE users SET name = ?, surname =?, email=? WHERE id =? ', [name,surname,email, id]);

         if(result.affectedRows === 0){
             res.status(404).json({
                error: 'Upload did not take place'
             })
         }else{
             res.status(200).json({
              message: 'User updated',
              id : id
          })

         }

    }catch(err){
       next(err);
    };
};

  // PATCH
const updateUserPatch = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const {name,surname,email} = req.body;
         const fields = [];
         const values = [];
           
         //controllo dei campi
         if(name){
            fields.push('name = ?');
            values.push(name)
         }
          if(surname){
            fields.push('surname=?');
            values.push(surname)
         }
         if(email){
            fields.push('email=?');
            values.push(email)
         };

         //controllo se ci sono i campi
         if(fields.length === 0){
            res.status(400).json({
                error: 'Dati mancanti o errati. Campi ammessi: name,surname,email'
            })
            return;
         }

         values.push(id)

         //query
         const [result] = await pool.execute(`UPDATE users SET ${fields.join(',')} WHERE id =?`, values);
         console.log(result);

         if(result.affectedRows === 0){
            res.status(404).json({
                error: 'User not found'
            })

         }else{
             res.status(200).json({
             message: 'Update avvenuto con successo!!',
             id: id,
         })

         }

    }catch(err){
        next(err)
    }
}




export default {getAllUsers, getUserId, addNewUser, deleteUser, userUpdate, updateUserPatch}