import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/users.controllers';

const userRouters = Router();
userRouters.get('/users', getUsers); 
userRouters.post('/users', createUser); 
userRouters.put('/user/:id', updateUser); 
userRouters.delete('/user/:id', deleteUser); 



export default userRouters;