// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetRestaurantFromPk($id: uuid!) {
    restaurants_by_pk(id: $id) {
      id
      pin
    }
  }
`;

interface Restaurant {
  id: string;
  pin: string;
}

export interface RestaurantPkData {
  restaurants_by_pk: {
    id: string;
    pin: string;
  };
}

export interface RestaurantPkVars {
  id: string;
}
