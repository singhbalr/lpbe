// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query GetCheckinData(
    $user_id: String!
    $_gte: timestamptz = ""
    $_lte: timestamptz = ""
    $restaurant_id: uuid!
  ) {
    users_by_pk(id: $user_id) {
      rank {
        id
        checkin_rate
      }
      checkins_aggregate(
        limit: 1
        where: {
          user_id: {_eq: $user_id}
          created_at: {_gte: $_gte}
          _and: {
            created_at: {_lte: $_lte}
            restaurant_id: {_eq: $restaurant_id}
          }
        }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;
