// routes to get a users' datas


import { Router } from 'express';
import usersControllers from '../controllers/usersControllers.js';

 const usersRouter = Router()

usersRouter.get('/', usersControllers.getAllUsers);

//method to get a specific users' data using the id
usersRouter.get('/:id', usersControllers.getUserId);


// create a new user with POST

usersRouter.post('/', usersControllers.addNewUser);



// delete an user
usersRouter.delete('/:id', usersControllers.deleteUser);


//update an user
usersRouter.put('/:id', usersControllers.userUpdate);
usersRouter.patch('/:id', usersControllers.updateUserPatch)

export default usersRouter