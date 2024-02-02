// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation UpdateUserRank(
    $userId: String!,
    $from_rank_id: String!,
    $to_rank_id: String!,
    $current_point: Int!,
    $total_earnings: Int!,
    $last_tested_at: timestamptz
  ) {
    update_users_by_pk(
      _set: {rank_id: $to_rank_id, last_tested_at: $last_tested_at}
      pk_columns: {id: $userId}
    ) {
      id
      rank_id
    }
    insert_rank_histories_one(
      object: {
        user_id: $userId
        from_rank_id: $from_rank_id
        to_rank_id: $to_rank_id
        current_point: $current_point
        total_earnings: $total_earnings
      }
    ) {
      user_id
      from_rank_id
      to_rank_id
    }
  }
`;

export interface UpdateUserRankVars {
  userId: string;
  from_rank_id: string;
  to_rank_id: string;
  current_point: number;
  total_earnings: number;
  last_tested_at?: string;
}

export interface UpdateUserRankData {
  update_users_by_pk: {
    id: string;
    rank_id: string;
  };
  insert_rank_histories_one: {
    user_id: string;
    from_rank_id: string;
    to_rank_id: string;
  };
}
