import express from 'express';
const routes = express.Router();

routes.get('/', (request, response) => {
  return response.send('Olá Internet');
});

export default routes;