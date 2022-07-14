import { Router } from 'express';

import RecordController from '../controllers/recordController'
import authToken from '../middlewares/auth';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('server is running!')
})

routes.get('/api/v1/records/current', RecordController.getCurrent);
routes.get('/api/v1/records/today', RecordController.today);
routes.get('/api/v1/records/index', RecordController.getAll);
routes.get('/api/v1/records/day', RecordController.getDay);
routes.get('/api/v1/records/day_details', RecordController.getDayDetails);
routes.get('/api/v1/records/month', RecordController.getMonth);
routes.get('/api/v1/records/month_details', RecordController.getMonthDetails);
routes.get('/api/v1/records/year', RecordController.getYear);
routes.get('/api/v1/records/year_details', RecordController.getYearDetails);

routes.post('/api/v1/records/register', authToken, RecordController.create);

export default routes;