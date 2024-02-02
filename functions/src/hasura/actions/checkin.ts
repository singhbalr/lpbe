// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import GraphqlAdmin from '../../libs/graphql-admin';
import GET_CHECKIN_DATA from '../../schemas/get-checkin-data';
import INSERT_CHECKIN from '../../schemas/insert_checkin';

dayjs.extend(utc);
dayjs.extend(timezone);


interface Input {
  checkinInput: {
    restaurant_id: string;
    lon: number;
    lat: number;
  };
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

interface CheckinVars {
  user_id: string;
  extras: JSON;
  location: JSON;
  restaurant_id: string;
  amount: number;
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
      restaurant_id: input.checkinInput.restaurant_id || '',
    }
  );

  if (result.users_by_pk.checkins_aggregate.aggregate.count > 0) {
    console.log(`User ${userId} has checkin `);
    return res.json({is_checkin: true});
  } else {
    console.log(`User ${userId} no checkin `);
    const point = process.env.POINT_CHECKIN || 1;
    try {
      await GraphqlAdmin.request<any, CheckinVars>(INSERT_CHECKIN, {
        user_id: userId,
        restaurant_id: input.checkinInput.restaurant_id,
        amount: +point * result.users_by_pk.rank.checkin_rate,
        location: JSON.parse(
          JSON.stringify({
            type: 'Point',
            coordinates: [input.checkinInput.lon, input.checkinInput.lat],
          })
        ),
        extras: JSON.parse(
          JSON.stringify({
            rank: result.users_by_pk.rank,
            point: point,
          })
        ),
      });
      return res.json({is_checkin: true});
    } catch (error) {
      console.error(error);
      return res.json({is_checkin: false});
    }
  }
};
