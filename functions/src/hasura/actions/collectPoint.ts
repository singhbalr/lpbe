// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import {ClientError} from 'graphql-request';

import GraphqlAdmin from '../../libs/graphql-admin';
import COLLECT_POINT, {
  CollectPointData,
  CollectPointVars,
} from '../../schemas/collect-point';

interface Input {
  point_shares_id: string;
  point: number;
}

export default async (req: Request, res: Response) => {
  const {session_variables, input}: Action<Input> = req.body;
  const userId = session_variables!['x-hasura-user-id'];

  if (!input || input.point! <= 0) {
    return res.status(400).json({message: 'INPUT_DATA_ERROR'});
  }

  try {
    const result = await GraphqlAdmin.request<
      CollectPointData,
      CollectPointVars
    >(COLLECT_POINT, {
      user_id: userId,
      point_shares_id: input.point_shares_id,
      points: input.point,
      balanceDown: input.point * -1,
    });
    console.log('CollectPoint result', result);
    return res.json({
      point_collects_id: result.insert_point_collects_one.id,
      balance: result.update_point_shares_by_pk.balance,
      points: result.update_point_shares_by_pk.points,
    });
  } catch (error) {
    console.error(error);
    if (
      error instanceof ClientError &&
      error.message.indexOf('point_shares_balance_check') >= 0
    ) {
      return res
        .status(400)
        .json({message: 'COLLECT_POINT_MORE_THAN_CURRENT_BALANCE'});
    }
  }
  return res.status(400).json({message: 'COLLECT_ERROR'});
};
