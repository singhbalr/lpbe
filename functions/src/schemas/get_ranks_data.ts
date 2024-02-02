// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetUserRankData($userId: String!) {
    users_by_pk(id: $userId) {
      rank_id
      last_tested_at
      point {
        balance
        total_earnings
      }
      rank_histories(order_by: {created_at: desc}, limit: 1) {
        to_rank_id
        created_at
      }
    }
    ranks(order_by: {from_point: asc_nulls_first}) {
      id
      from_point
      to_point
    }
  }
`;

export interface Rank {
  id: string;
  from_point: number | null;
  to_point: number | null;
}

export interface UserRankVars {
  userId: string;
}

export interface UserRankData {
  users_by_pk: {
    rank_id: string;
    last_tested_at: Date | null;
    rank_histories: Array<{
      to_rank_id: string;
      created_at: Date
    }> | null;
    point: {
      balance: number;
      total_earnings: number;
    }
  };
  ranks: Rank[];
}
