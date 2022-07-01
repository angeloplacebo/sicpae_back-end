import { Router } from 'express';

import RecordController from '../controllers/recordController'

const routes = Router();

routes.post('/api/v1/register', RecordController.create);

export default routes;