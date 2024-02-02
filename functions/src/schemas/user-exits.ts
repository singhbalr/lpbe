// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  query UserExits($user_id: String!) {
    users_by_pk(id: $user_id) {
      id
      point {
        id
      }
    }
  }
`;
