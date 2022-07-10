import { Router } from 'express';

import RecordController from '../controllers/recordController'

const routes = Router();

routes.get('/', (req, res) => {
  res.send('server is running!')
})

routes.get('/api/v1/index', RecordController.getAll);
routes.get('/api/v1/current', RecordController.getCurrent);
routes.get('/api/v1/today', RecordController.today);
routes.get('/api/v1/day', RecordController.getDay);
routes.get('/api/v1/day_details', RecordController.getDayDetails);
routes.get('/api/v1/month', RecordController.getMonth);
routes.get('/api/v1/month_details', RecordController.getMonthDetails);
routes.get('/api/v1/year', RecordController.getYear);
routes.get('/api/v1/year_details', RecordController.getYearDetails);

routes.post('/api/v1/register', RecordController.create);

export default routes;