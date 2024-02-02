// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import jwt from 'jsonwebtoken';

import {Rank} from '../schemas/get_ranks_data';

import GraphqlAdmin from '../libs/graphql-admin';
import GET_RESTAURANT_FROM_PIN, {
  RestaurantData,
  RestaurantVars,
} from '../schemas/get-restaurant-from-pin';

import GET_RESTAURANT_FROM_PK, {
  RestaurantPkData,
  RestaurantPkVars,
} from '../schemas/get-restaurant-from-pk';

export const pointToRank = (currentTotalPoint: number, ranks: Rank[]) => {
  const length = ranks.length;
  for (let i = 0; i < length; i++) {
    const rank = ranks[i];
    if (
      (!rank.from_point || currentTotalPoint >= rank.from_point) &&
      (!rank.to_point || currentTotalPoint <= rank.to_point)
    ) {
      return rank.id;
    }
  }
  return 'Mate'; // Default rank
};

export const getRestaurantFromPin = (pin: number) => {
  return GraphqlAdmin.request<RestaurantData, RestaurantVars>(
    GET_RESTAURANT_FROM_PIN,
    {pin}
  );
};

export const staffCreateJwt = (
  restaurant_id: string,
  restaurant_name: string,
  pin: number
) => {
  try {
    return jwt.sign(
      {restaurant_id, restaurant_name},
      `Loyalty${pin}Restaurant`,
      {expiresIn: '60 days'}
    );
  } catch (error) {
    console.log('error', error);
  }
  return null;
};

export const staffDecodeJwt = async (token: string) => {
  const decoded = jwt.decode(token);
  console.log('decoded', decoded);
  if (!decoded) {
    return null;
  }

  try {
    const {restaurants_by_pk} = await GraphqlAdmin.request<
      RestaurantPkData,
      RestaurantPkVars
    >(GET_RESTAURANT_FROM_PK, {id: (decoded as any).restaurant_id});

    const object = jwt.verify(
      token,
      `Loyalty${restaurants_by_pk.pin}Restaurant`
    );
    console.log('object', object);
    return object;
  } catch (error) {
    console.log(error);
  }

  return null;
};
