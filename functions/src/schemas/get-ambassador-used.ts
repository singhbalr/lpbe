// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
export default gql`
  query GetAmbassadorUsed(
    $user_id: String!
    $endDateAmbassador: timestamptz!
    $todayStart: timestamptz!
    $todayEnd: timestamptz!
  ) {
    point_transactions_aggregate(
      where: {
        user_id: {_eq: $user_id}
        type_id: {_in: [CHECKIN, COLLECT, INSTALL]}
        created_at: {_gte: $endDateAmbassador}
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    exchange_products_aggregate(
      where: {
        created_at: {_gte: $todayStart}
        _and: {created_at: {_lte: $todayEnd}}
        exchange_type_id: {_eq: AMBASSADOR}
        exchange: {user_id: {_eq: $user_id}}
      }
    ) {
      aggregate {
        count
      }
    }
    exchange_products(
      where: {
        _not: {exchange_type_id: {_in: [AMBASSADOR, POINT]}}
        exchange: {user_id: {_eq: $user_id}}
      }
      distinct_on: exchange_type_id
    ) {
      exchange_type_id
    }
  }
`;

export interface Vars {
  user_id: string;
  endDateAmbassador: string;
  todayStart: string;
  todayEnd: string;
}

export interface Data {
  point_transactions_aggregate: {
    aggregate: {
      sum: {amount: number | null};
    };
  };
  exchange_products_aggregate: {
    aggregate: {
      count: number;
    };
  };
}
