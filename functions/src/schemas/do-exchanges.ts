// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
import {TransactionType} from './model';

export default gql`
  mutation ActionExchanges(
    $user_id: String!
    $point_transaction: point_transactions_obj_rel_insert_input
    $total_points: Int
    $exchangeProducts: [exchange_products_insert_input!]!
    $restaurant_id: uuid!
  ) {
    insert_exchanges_one(
      object: {
        user_id: $user_id
        point_transaction: $point_transaction
        total_points: $total_points
        products: {data: $exchangeProducts}
        restaurant_id: $restaurant_id
      }
    ) {
      id
      created_at
    }
  }
`;

export interface ExchangeData {
  insert_exchanges_one: {
    id: string;
    created_at: Date;
  };
}

export interface PointTransactionVars {
  data: {
    amount: number;
    user_id: string;
    type_id: TransactionType;
  };
}

export interface ExchangeProductVars {
  product_id: string;
  exchange_type_id: string;
  amount: number;
  extras: JSON;
}

export interface ExchangeVars {
  user_id: string;
  point_transaction?: PointTransactionVars;
  total_points?: number;
  exchangeProducts: ExchangeProductVars[];
  restaurant_id: string;
}
