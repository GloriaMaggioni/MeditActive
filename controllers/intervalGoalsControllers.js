import pool from "../config/db.js";
import checkId from "../utils/checkId.js";



// GET
const getAllDatas = async (req,res, next) =>{

    try{
        //Query to join the intervals table and the goals table into a intervalGoals table
        const [rows] = await pool.execute(`
        SELECT goals.name, intervalli.data_inizio, intervalli.data_fine, tabellaPonte.intervallo_id, tabellaPonte.goal_id, tabellaPonte.status
          FROM tabellaPonte
            JOIN intervalli ON tabellaPonte.intervallo_id = intervalli.id
            JOIN goals ON tabellaPonte.goal_id = goals.id;

         `);
         res.status(200).json(rows);

    }catch(err){
       next(err)
    }
};


// POST

const addNewDatas = async (req, res, next) =>{
    try{
        const {intervallo_id, goal_id} = req.body;
        if (!intervallo_id || !goal_id){
            res.status(400).json({
                err: "Insert correct datas"
            })
        }else{
            const [newDatas] = await pool.execute(`
                INSERT INTO tabellaPonte (intervallo_id, goal_id) VALUES (?,?)`,
                [intervallo_id,goal_id]);
            res.status(201).json({
                message: "Goal's data successfully added to interval's data"
            })
        }
    }catch(err){
        next(err)
    }
};



// create with the purpose to change the status' value
const updateDatas = async (req, res, next) =>{                    //PATCH
    try{
      
        const {intervallo_id, goal_id} = req.params;
        const controlIntervalloId = checkId(intervallo_id);
        const controlGoalId = checkId(goal_id)
        const {status} = req.body;

        if(controlIntervalloId){
            return next(controlIntervalloId)
        };
        if(controlGoalId){
            return next(controlGoalId)
        }

        const validateStatus = ['active', 'finished', 'deleted', 'suspended'];
        if(!validateStatus.includes(status)){
           res.status(400).json({
             err: 'Status not valid' 
           });
           return;
        }

        const [result] = await pool.execute(`UPDATE tabellaPonte SET status = ? WHERE intervallo_id = ? AND goal_id = ?`, [status, intervallo_id, goal_id]);

        if(result.affectedRows === 0){
            res.status(404).json({
                err: 'Data not found'
            })
        }else{
            res.status(200).json({
                message:  'Update completed successfully'
            })
        }

    }catch(err){
        next(err)
    }
};



export default {getAllDatas, addNewDatas, updateDatas}






   