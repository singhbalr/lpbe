// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetProductsFromList($ids: [uuid!]!) {
    products(where: {id: {_in: $ids}}) {
      id
      is_exchange_ambassador
      is_exchange_install
      is_exchange_point
      is_exchange_bonus_install
      exchange_point
    }
  }
`;

export interface Product {
  id: string;
  exchange_point: number;
  is_exchange_ambassador: boolean;
  is_exchange_point: boolean;
  is_exchange_install: boolean;
  is_exchange_bonus_install: boolean;
}

export interface ProductVars {
  ids: string[];
}

export interface ProductData {
  products: Product[];
}
