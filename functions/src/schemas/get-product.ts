// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetProduct($id: uuid!) {
    products_by_pk(id: $id) {
      id
      exchange_point
      is_exchange_ambassador
      is_exchange_point
      is_exchange_install
    }
  }
`;

interface Product {
  id: string;
  exchange_point: number;
  is_exchange_ambassador: boolean;
  is_exchange_point: boolean;
  is_exchange_install: boolean;
}

export interface ProductVars {
  id: string;
}

export interface ProductData {
  products_by_pk: Product;
}
