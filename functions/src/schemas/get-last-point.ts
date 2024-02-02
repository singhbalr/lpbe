// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetLastEarnPoint($user_id: String!) {
    users_by_pk(id: $user_id) {
      created_at
      rollbacks(order_by: {created_at: desc}, limit: 1) {
        created_at
      }
      point_transactions(
        limit: 1
        order_by: {created_at: desc}
        where: {type_id: {_in: [CHECKIN, COLLECT, INSTALL]}}
      ) {
        created_at
        type_id
      }
    }
  }
`;

export interface LastEarnPointVars {
  user_id: string;
}

export interface LastEarnPointData {
  users_by_pk: {
    created_at: Date;
    rollbacks: Array<{
      created_at: Date;
    }>;
    point_transactions: Array<{
      created_at: Date;
      type_id: string;
    }>;
  };
}
