// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
import {TransactionType} from './model';

export default gql`
  mutation InsertManyPointTransaction(
    $objects: [point_transactions_insert_input!]!
  ) {
    insert_point_transactions(objects: $objects) {
      affected_rows
    }
  }
`;

interface PointTransaction {
  amount: number;
  type_id: TransactionType;
  user_id: string;
}

export interface PointTransactionVars {
  objects: PointTransaction[];
}

export interface PointTransactionData {
  insert_point_transactions: {
    affected_rows: number;
  };
}
