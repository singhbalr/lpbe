// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
import {RankType} from './model';

export default gql`
  query GetUserCanRollbacks($datePoint: timestamptz!, $limit: Int!) {
    users_aggregate(
      where: {
        created_at: {_lte: $datePoint}
        _and: {_not: {rollbacks: {created_at: {_gte: $datePoint}}}}
        _not: {point_transactions:{created_at: {_gte:$datePoint},amount: {_gt:0}}}
      }
    ) {
      aggregate {
        count
      }
    }
    users(
      limit: $limit
      where: {
        created_at: {_lte: $datePoint}
        _and: {_not: {rollbacks: {created_at: {_gte: $datePoint}}}}
        _not: {point_transactions:{created_at: {_gte:$datePoint},amount: {_gt:0}}}
      }
    ) {
      id
      email
      rank_id
      point {
        balance
        total_earnings
      }
    }
  }
`;

export interface UserRollbackInVars {
  datePoint: string;
  limit: number;
}

export interface UserRollbackData {
  users_aggregate: {
    aggregate: {
      count: number;
    };
  };
  users: Array<{
    id: string;
    rank_id: RankType;
    point: {
      balance: number;
      total_earnings: number;
    } | null;
  }>;
}
