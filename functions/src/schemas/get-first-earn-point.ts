// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
import {TransactionType} from './model';

export default gql`
  query GetUserFirstEarnPoint($user_id: String!) {
    point_transactions(
      where: {user_id: {_eq: $user_id}, type_id: {_in: [CHECKIN, COLLECT]}}
      order_by: {created_at: asc}
      limit: 1
    ) {
      created_at
      type_id
    }
  }
`;

export interface FirstEarnPointVars {
  user_id: string;
}

export interface FirstEarnPointData {
  point_transactions: Array<{
    created_at: Date;
    type_id: TransactionType;
  }> | null;
}
