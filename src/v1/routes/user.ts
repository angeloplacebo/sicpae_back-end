import { Router } from 'express';
import UserController from '../controllers/userController';

const routes = Router();

routes.post('/api/v1/user/register', UserController.register); 
routes.post('/api/v1/user/authenticate', UserController.authenticate);
routes.post('/api/v1/user/token', UserController.token);
routes.delete('/api/v1/user/logout', UserController.logout);

export default routes;