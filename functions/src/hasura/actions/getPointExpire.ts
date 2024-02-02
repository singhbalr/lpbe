// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import R from 'ramda';

import GraphqlAdmin from '../../libs/graphql-admin';
import GET_LAST_CHECK_IN, {
  LastEarnPointVars,
  LastEarnPointData,
} from '../../schemas/get-last-point';

dayjs.extend(utc);

export default async (req: Request, res: Response) => {
  const {session_variables}: Action<unknown> = req.body;
  const userId = session_variables!['x-hasura-user-id'];
  if (!userId) {
    return res.status(400).json({message: 'USER_NOT_FOUND'});
  }

  try {
    const { users_by_pk} = await GraphqlAdmin.request<
      LastEarnPointData,
      LastEarnPointVars
    >(GET_LAST_CHECK_IN, {
      user_id: userId,
    });

    const today = dayjs();

    let startDate;

    console.log('users_by_pk', users_by_pk);

    if (users_by_pk.point_transactions.length > 0) {
      startDate = users_by_pk.point_transactions[0].created_at;
    } else if (
      R.isNil(users_by_pk.rollbacks) ||
      R.isEmpty(users_by_pk.rollbacks)
    ) {
      startDate = users_by_pk.created_at;
    } else {
      startDate = users_by_pk.rollbacks[0].created_at;
    }

    const latsCheckedAt = dayjs(startDate);
    //console.log('latsCheckedAt', latsCheckedAt.toString());
    const deadlineAt = latsCheckedAt.add(30, 'day');
    //console.log('deadlineAt', deadlineAt.toString());
    const is_expired = today.isAfter(deadlineAt);
    //console.log('is_expired', is_expired);
    const expired_at = deadlineAt.toISOString();
    return res.json({expired_at, is_expired});
  } catch (error) {
    console.log(error);
  }
  return res.status(400).json({message: 'ERR_USER_NOT_FOUND'});
};
