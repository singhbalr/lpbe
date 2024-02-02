// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import R from 'ramda';

import GraphqlAdmin from '../../libs/graphql-admin';
import {getRestaurantFromPin, staffDecodeJwt} from '../utils';
import CREATE_POINT_SHARE, {
  PointShareData,
  PointShareVars,
} from '../../schemas/create-point-share';

interface Input {
  points: number;
}

export default async (req: Request, res: Response) => {
  const {session_variables, input}: Action<Input> = req.body;

  console.log('session_variables', session_variables);

  const token = session_variables!['x-hasura-restaurant-token'];

  if (!input || input.points <= 0) {
    return res.status(400).json({message: 'INPUT_DATA_ERROR'});
  }

  const restaurant = await staffDecodeJwt(token);

  if (!restaurant) {
    return res.status(400).json({message: 'RESTAURANT_TOKEN_ERROR'});
  }

  try {
    const {
      insert_point_shares_one: {id: point_shares_id},
    } = await GraphqlAdmin.request<PointShareData, PointShareVars>(
      CREATE_POINT_SHARE,
      {points: input?.points!, restaurant_id: (restaurant as any).restaurant_id}
    );

    return res.json({point_shares_id, points: input.points});
  } catch (error) {
    console.error(error);
  }
  return res.status(400).json({message: 'CREATE_QRCODE_ERROR'});
};
