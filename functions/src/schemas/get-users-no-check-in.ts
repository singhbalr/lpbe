// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetUsersNoCheckIn($date: timestamptz!, $limit: Int = 100) {
    users(
      where: {
        created_at: {_lt: $date}
        point_transactions: {
          type_id: {_neq: CHECKIN}
          _and: {type_id: {_eq: INSTALL}}
        }
        _not: {point_transactions: {amount: {_lte: 0}, type_id: {_eq: INSTALL}}}
      }
      limit: $limit
    ) {
      id
      point_transactions(where: {type_id: {_eq: INSTALL}}, limit: 1) {
        amount
      }
    }
  }
`;
