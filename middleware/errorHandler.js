

const errorHandler  = (err,req,res,next) =>{
    let statusCode = 500;
    let message = '';
     let error = '';

    switch(err.code) {
        case 'ER_DUP_ENTRY':
        statusCode = 409;    // Conflict
        error = 'Datas conflict'
        message = 'The value add is already exist'
        break;

        
        case 'NOT FOUND':      // NOT FOUND
        statusCode = 404;
        error = 'Not Found'
        message = 'Search data is not found';
        break;
        
        case 'ER_NO_REFERENCED_ROW_2':
        case 'ER_BAD_NULL_ERROR':
        case 'ER_DATA_TOO_LONG':    // BAD REQUEST
        statusCode = 400;
        error = 'Datas not valid'
        message = 'Check the datas and their format'
        break;

        default :
        statusCode = 500;
        error = 'Interval Server Error'
        message = 'An unexpected problem has occurred'
    };

    res.status(statusCode).json({
        error : error,
        message : message
    })

};



export default errorHandler