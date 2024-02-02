// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation CreateUser(
    $id: String!
    $gender_id: genders_enum
    $name: String
    $email: String!
    $birthdate: date
    $restaurant_id: uuid
  ) {
    insert_users_one(
      object: {
        id: $id
        gender_id: $gender_id
        name: $name
        email: $email
        birthdate: $birthdate
        restaurant_id: $restaurant_id
        role_id: user
      }
    ) {
      id
      updated_at
    }
  }
`;
