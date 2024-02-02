// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';

export default gql`
  mutation InsertPointTransaction(
    $amount: Int!
    $type_id: transaction_type_enum!
    $user_id: String!
  ) {
    insert_point_transactions_one(
      object: {amount: $amount, type_id: $type_id, user_id: $user_id}
    ) {
      id
      after_balance
      before_balance
      amount
      type_id
    }
  }
`;
