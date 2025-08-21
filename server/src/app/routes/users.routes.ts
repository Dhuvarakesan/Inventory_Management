import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/users.controllers';

const userRouters = Router();
userRouters.get('/users', getUsers); 
userRouters.post('/users', createUser); 
userRouters.put('/users/:id', updateUser); 
userRouters.delete('/users/:id', deleteUser); 



export default userRouters;