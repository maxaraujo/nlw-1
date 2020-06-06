import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  
  async crate (request: Request, response: Response){
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      items
    } = request.body;
  
    const trx = await knex.transaction();

    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      uf
    }
  
    const insertedIds = await trx('point').insert(point)
  
    const point_id = insertedIds[0];
  
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id
      };
    });
  
    await trx('point_items').insert(pointItems);
    
    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    }); 
  }

  async index(request: Request, response: Response){
    const { uf, items } = request.query;
    const parseItems = String(items).split(',').map(item => Number(item.trim()));
    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parseItems)
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  async show (request: Request, response: Response){
    const { id } = request.params;
    const point = await knex('point').where('id', id).first();

    if(!point){
      return response.status(400).json({message: 'Point not found.'});
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id);

    return response.json({point, items});
  }

}

export default PointsController;