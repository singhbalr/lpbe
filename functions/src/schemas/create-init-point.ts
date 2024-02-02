// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation CreatePointInt($user_id: String!) {
    insert_points_one(object: {user_id: $user_id}) {
      id
    }
  }
`;
