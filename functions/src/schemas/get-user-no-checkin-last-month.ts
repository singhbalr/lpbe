// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

import {RankType} from './model';

export default gql`
  query GetUserNoCheckInLastMonth($startMonth: timestamptz!, $limit: Int!) {
    users_aggregate(
      where: {
        created_at: {_lte: $startMonth}
        point_transactions: {
          _not: {
            type_id: {_eq: ROLLBACK}
            _and: {type_id: {_eq: CHECKIN}, created_at: {_gte: $startMonth}}
            created_at: {_gte: $startMonth}
          }
        }
        _not: {rank_id: {_eq: "Mate"}, point: {balance: {_eq: 0}}}
      }
    ) {
      aggregate {
        count
      }
    }
    users(
      limit: $limit
      where: {
        created_at: {_lte: $startMonth}
        point_transactions: {
          _not: {
            type_id: {_eq: ROLLBACK}
            _and: {type_id: {_eq: CHECKIN}, created_at: {_gte: $startMonth}}
            created_at: {_gte: $startMonth}
          }
        }
        _not: {rank_id: {_eq: "Mate"}, point: {balance: {_eq: 0}}}
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

export interface UserNoCheckInVars {
  startMonth: string;
  limit: number;
}

export interface UserNoCheckData {
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
