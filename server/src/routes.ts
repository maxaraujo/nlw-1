import express from 'express';
import PointController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const pointController = new PointController();
const itemController = new ItemsController();

//padrão da comunidade
//index: listagem
//show: único registro
//create, update e delete

routes.get('/items',itemController.index);

routes.post('/points', pointController.crate);
routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);

export default routes;

/*TODO
** Colocar o código nos padrões:
** Service Pattern
** Repository Pattern (Data Mapper) 
*/