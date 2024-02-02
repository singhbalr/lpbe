// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation DeleteUser($id: String!, $email: String!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { email: $email}) {
      id
    }
  }
`;


