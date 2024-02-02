// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation CreatePointShare($points: Int!, $restaurant_id: uuid!) {
    insert_point_shares_one(
      object: {restaurant_id: $restaurant_id, points: $points, balance: $points}
    ) {
      id
    }
  }
`;

export interface PointShareVars {
  points: number;
  restaurant_id: string;
}

export interface PointShareData {
  insert_point_shares_one: {
    id: string;
  };
}
