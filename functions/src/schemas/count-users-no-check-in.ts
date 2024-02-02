// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetCountUsersNoCheckIn($date: timestamptz!) {
    users_aggregate(
      where: {
        created_at: {_lt: $date}
        point_transactions: {
          type_id: {_neq: CHECKIN}
          _and: {type_id: {_eq: INSTALL}}
        }
        _not: {point_transactions: {amount: {_lte: 0}, type_id: {_eq: INSTALL}}}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
