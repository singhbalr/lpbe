// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetUserExchangeData($userId: String!) {
    users_by_pk(id: $userId) {
      point {
        balance
      }
      rank_id
    }
  }
`;

export interface UserExchangeVars {
  userId: string;
}

export interface UserExchangeData {
  users_by_pk: {
    point: {
      balance: number;
    };
    rank_id: string;
  };
}
