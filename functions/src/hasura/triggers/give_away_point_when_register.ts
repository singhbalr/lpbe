// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import GraphqlAdmin from '../../libs/graphql-admin';

import {InsertPointTransactionVars, TransactionType} from '../../schemas/model';
import INSERT_POINT_TRANSACTION from '../../schemas/insert-point-transaction';

interface NewUser {
  id: string;
}

export default async (req: Request, res: Response) => {
  const {event}: EventTrigger<NewUser> = req.body;

  const userId = event.data.new?.id;
  if (!userId) {
    return res.status(400).json({message: 'userId not found'});
  } else if (!process.env.POINT_GIVEAWAY_INSTALL) {
    return res
      .status(400)
      .json({message: 'env POINT_GIVEAWAY_INSTALL not found'});
  }

  const result = await GraphqlAdmin.request<any, InsertPointTransactionVars>(
    INSERT_POINT_TRANSACTION,
    {
      user_id: `${userId}`,
      amount: +process.env.POINT_GIVEAWAY_INSTALL,
      type_id: TransactionType.INSTALL,
    }
  );

  return res.status(200).json(result.insert_point_transactions_one);
};
