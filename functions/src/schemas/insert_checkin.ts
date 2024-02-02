// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation InsertCheckin(
    $user_id: String!
    $extras: jsonb = ""
    $location: geography!
    $restaurant_id: uuid!
    $amount: Int!
  ) {
    insert_checkins_one(
      object: {
        user_id: $user_id
        extras: $extras
        location: $location
        restaurant_id: $restaurant_id
        point_transaction: {
          data: {amount: $amount, type_id: CHECKIN, user_id: $user_id}
        }
      }
    ) {
      created_at
    }
  }
`;
