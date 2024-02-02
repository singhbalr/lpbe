// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
import {TransactionType} from './model';

export default gql`
  mutation Rollback(
    # $user_id: String!
    # $from_rank_id: String = ""
    # $current_point: Int = 10
    # $to_rank_id: String = ""
    # $total_earnings: Int = 10
    # $amount: Int = 10
    $rollbackObjects: [rollbacks_insert_input!]!
  ) {
    insert_rollbacks(objects: $rollbackObjects) # objects: {
    #   user_id: $user_id
    #   rank_history: {
    #     data: {
    #       from_rank_id: $from_rank_id
    #       current_point: $current_point
    #       to_rank_id: $to_rank_id
    #       total_earnings: $total_earnings
    #       user_id: $user_id
    #     }
    #   }
    #   point_transaction: {
    #     data: {amount: $amount, type_id: ROLLBACK, user_id: $user_id}
    #   }
    # }
    {
      affected_rows
    }
  }
`;

interface RollbacksInsertInput {
  user_id: string;
  rank_history: {
    data: {
      from_rank_id: string;
      current_point: number;
      to_rank_id: string;
      total_earnings: number;
      user_id: string;
    };
  };
  point_transaction: {
    data: {
      amount: number;
      type_id: TransactionType;
      user_id: string;
    };
  };
}

export interface RollbackVars {
  rollbackObjects: RollbacksInsertInput[];
}
