// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import R from 'ramda';
import {getRestaurantFromPin, staffCreateJwt} from '../utils';

interface Input {
  pin: number;
}

export default async (req: Request, res: Response) => {
  const {input}: Action<Input> = req.body;

  if (!input || !input.pin) {
    return res.status(400).json({message: 'INPUT_DATA_ERROR'});
  }

  const {restaurants} = await getRestaurantFromPin(input.pin);

  if (R.isEmpty(restaurants)) {
    return res.status(400).json({message: 'RESTAURANT_NOT_FOUND'});
  }

  const restaurant = restaurants[0];
  const token = staffCreateJwt(restaurant.id, restaurant.name, input.pin);

  return res.json({token});
};
