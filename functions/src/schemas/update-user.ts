// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation UpdateUser(
    $id: String!
    $birthdate: date
    $email: String!
    $gender_id: genders_enum
    $name: String
    $restaurant_id: uuid
  ) {
    update_users_by_pk(
      pk_columns: {id: $id}
      _set: {
        birthdate: $birthdate
        gender_id: $gender_id
        name: $name
        email: $email
        restaurant_id: $restaurant_id
      }
    ) {
      id
      updated_at
    }
  }
`;
