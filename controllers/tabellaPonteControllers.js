import pool from "../config/db.js";


// GET
const getAllDatas = async (req,res) =>{

    try{

    }catch(error){
        res.status(500).json({
            error: 'Error '
        })
    }
}



export default {getAllDatas}