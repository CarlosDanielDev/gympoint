import { Router } from 'express';
import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrderController';
import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.get('/students/:student_id/checkin', CheckinController.index);
routes.post('/students/:student_id/checkin', CheckinController.store);
routes.post('/students/:student_id/help-orders', HelpOrdersController.store);
routes.get('/students/:student_id/help-orders', HelpOrdersController.show);

routes.use(auth);
routes.get('/help-orders', HelpOrdersController.index);
routes.put('/help-orders/:help_order_id/answer', HelpOrdersController.update);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:enrollment_id', EnrollmentController.update);
routes.delete('/enrollments/:enrollment_id', EnrollmentController.delete);

export default routes;
