// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import R from 'ramda';

import GraphqlAdmin from '../../libs/graphql-admin';
import GET_USER_CAN_ROLLBACKS, {
  UserRollbackData,
  UserRollbackInVars,
} from '../../schemas/get-users-can-rollback';
import DO_ROLLBACK_RANK, {RollbackVars} from '../../schemas/do-rollback-rank';
import {RankType, TransactionType} from '../../schemas/model';

dayjs.extend(utc);

const rollback = async (date: string, limit: number) => {
  const {users_aggregate, users} = await GraphqlAdmin.request<
    UserRollbackData,
    UserRollbackInVars
  >(GET_USER_CAN_ROLLBACKS, {
    datePoint: date,
    limit: limit,
  });
  console.log(
    'GET_USER_NO_CHECK_IN_LAST_MONTH ',
    users_aggregate.aggregate.count
  );
  let affected_rows = 0;
  if (users_aggregate.aggregate.count > 0) {
    //console.log('last30days users', users);

    const inputVars: RollbackVars = {
      rollbackObjects: [],
    };
    R.forEach(o => {
      inputVars.rollbackObjects.push({
        user_id: o.id,
        rank_history: {
          data: {
            user_id: o.id,
            current_point: o.point ? o.point.balance : 0,
            total_earnings: o.point ? o.point.total_earnings : 0,
            from_rank_id: o.rank_id,
            to_rank_id: RankType.Mate,
          },
        },
        point_transaction: {
          data: {
            amount: o.point ? o.point.balance : 0 * -1,
            type_id: TransactionType.ROLLBACK,
            user_id: o.id,
          },
        },
      });
    }, users);
    //console.log(inputVars.rollbackObjects);
    const {insert_rollbacks} = await GraphqlAdmin.request<any, RollbackVars>(
      DO_ROLLBACK_RANK,
      inputVars
    );
    affected_rows = affected_rows + insert_rollbacks.affected_rows;

    if (limit < users_aggregate.aggregate.count) {
      affected_rows = affected_rows + (await rollback(date, limit));
    }
  }
  return affected_rows;
};

export default async (req: Request, res: Response) => {
  const dayRollback = process.env.NUM_DAYS_TO_ROLLBACK_RANK || 30;
  const last30days = dayjs().subtract(+dayRollback, 'd');
  console.log('last30days', dayRollback, last30days.toISOString());
  const limit = 200;
  try {
    const affected_users = await rollback(last30days.toISOString(), limit);
    return res.json({message: 'OK', affected_users});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: 'ERR', error: error.message});
  }
};
