// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import GraphqlAdmin from '../../libs/graphql-admin';
import GET_CHECKIN_DATA from '../../schemas/get-checkin-data';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Input {
  restaurant_id: string;
}

interface GetCheckinVars {
  user_id: string;
  _gte: string;
  _lte: string;
  restaurant_id: string;
}

interface GetCheckinResult {
  users_by_pk: {
    rank: {
      id: string;
      checkin_rate: number;
    };
    checkins_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export default async (req: Request, res: Response) => {
  const {session_variables, input}: Action<Input> = req.body;

  const today = dayjs().tz('Asia/Tokyo');
  const startDay = today.hour(0).minute(0).second(0).millisecond(0).format();
  const endDay = today.hour(23).minute(59).second(59).millisecond(999).format();

  const userId = session_variables!['x-hasura-user-id'];
  if (!userId) {
    return res.json({is_checkin: false});
  } else if (!input) {
    return res.json({is_checkin: false});
  }

  console.log('input', input);

  const result = await GraphqlAdmin.request<GetCheckinResult, GetCheckinVars>(
    GET_CHECKIN_DATA,
    {
      user_id: userId,
      _gte: startDay,
      _lte: endDay,
      restaurant_id: input.restaurant_id || '',
    }
  );

  const point = process.env.POINT_CHECKIN || 1;

  return res.json({
    is_today_checkin: result.users_by_pk.checkins_aggregate.aggregate.count > 0,
    point: +point * result.users_by_pk.rank.checkin_rate,
  });
};
