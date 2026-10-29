import pool from "../config/db.js";


// GET
const getAllDatas = async (req,res) =>{

    try{
        /* query per unire table itervalli e table goals in tabellaPonte*/
        const [rows] = await pool.execute(`
           SELECT goals.name, intervalli.data_inizio, intervalli.data_fine, tabellaPonte.intervallo_id, tabellaPonte.goal_id, tabellaPonte.status
           FROM tabellaPonte
           JOIN intervalli ON tabellaPonte.intervallo_id = intervalli.id
           JOIN goals ON tabellaPonte.goal_id = goals.id;
         `);
         res.status(200).json(rows);
        

    }catch(error){
        res.status(500).json({
            error: 'Error '
        })
    }
};


// POST

const addNewDatas = async (req, res) =>{
    try{
        const {intervallo_id, goal_id} = req.body;
        if (!intervallo_id || !goal_id){
            res.status(400).json({
                error: "Insert correct datas"
            })
        }else{
            const [newDatas] = await pool.execute(`
                INSERT INTO tabellaPonte (intervallo_id, goal_id) VALUES (?,?)`,
                [intervallo_id,goal_id]);
            res.status(201).json({
                message: "Goal's datas successfully merged with intervallo's datas"
            })
        }
    }catch(err){
        res.status(500).json({
            err: ' Error into process of add new datas'
        })
    }
};


//PATCH

const updateDatas = async (req, res) =>{
    try{
      
        const {intervallo_id, goal_id} = req.params;
        const {status} = req.body;

        const validateStatus = ['active', 'finished', 'deleted', 'suspended'];
        if(!validateStatus.includes(status)){
           res.status(400).json({
             error: 'Status not valid' 
           });
           return;
        }

        const [result] = await pool.execute(`UPDATE tabellaPonte SET status = ? WHERE intervallo_id = ? AND goal_id = ?`, [status, intervallo_id, goal_id]);

        if(result.affectedRows === 0){
            res.status(404).json({
                error: 'Data not found'
            })
        }else{
            res.status(200).json({
                message: 'Datas successfully updated'
            })
        }

    }catch(err){
        res.status(500).json({
            err: 'Error during the update'
        })

    }
}



export default {getAllDatas, addNewDatas, updateDatas}