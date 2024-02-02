// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation CollectPoint(
    $points: Int!
    $point_shares_id: uuid!
    $balanceDown: Int!
    $user_id: String!
  ) {
    update_point_shares_by_pk(
      pk_columns: {id: $point_shares_id}
      _inc: {balance: $balanceDown}
    ) {
      id
      balance
      points
    }
    insert_point_collects_one(
      object: {
        point_shares_id: $point_shares_id
        point_transaction: {
          data: {amount: $points, user_id: $user_id, type_id: COLLECT}
        }
      }
    ) {
      id
    }
  }
`;

export interface CollectPointVars {
  points: number;
  point_shares_id: string;
  balanceDown: number;
  user_id: string;
}

export interface CollectPointData {
  update_point_shares_by_pk: {
    id: string;
    balance: number;
    points: number;
  };

  insert_point_collects_one: {
    id: string;
  };
}
