// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetRestaurantFromPin($pin: Int!) {
    restaurants(where: {pin: {_eq: $pin}}, limit: 1) {
      id
      name
    }
  }
`;

interface Restaurant {
  id: string;
  name: string;
}

export interface RestaurantData {
  restaurants: Restaurant[];
}

export interface RestaurantVars {
  pin: number;
}
