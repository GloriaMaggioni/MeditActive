// routes to get a users' datas


import { Router } from 'express';
import usersControllers from '../controllers/usersControllers.js';

 const router = Router()

router.get('/', usersControllers.getAllUsers);

//method to get a specific users' datas using the id
router.get('/:id', usersControllers.getUserId);


// create a new user with POST

router.post('/', usersControllers.addNewUser);



// delete an user
router.delete('/:id', usersControllers.deleteUser);


//update an user
router.put('/:id', usersControllers.userUpdate);
router.patch('/:id', usersControllers.updateUserPatch)

export default router