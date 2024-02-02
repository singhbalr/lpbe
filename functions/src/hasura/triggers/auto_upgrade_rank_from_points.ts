// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import GraphqlAdmin from '../../libs/graphql-admin';

import GET_RANKS_DATA, {
  UserRankData,
  UserRankVars,
} from '../../schemas/get_ranks_data';

import UPDATE_USER_RANK, {
  UpdateUserRankData,
  UpdateUserRankVars,
} from '../../schemas/update-user-rank';

import { pointToRank } from '../utils'

interface Point {
  id: string;
  user_id: string;
  balance: number;
  total_earnings: number;
  total_exchange: number;
}

export default async (req: Request, res: Response) => {
  const {event, trigger}: EventTrigger<Point> = req.body;
  //console.log('data', event.data);
  try {
    const userPoint = event.data.new as Point;
    const {users_by_pk, ranks} = await GraphqlAdmin.request<
      UserRankData,
      UserRankVars
    >(GET_RANKS_DATA, {userId: userPoint?.user_id});
    const currentRank = pointToRank(userPoint.total_earnings, ranks);
    console.log('ranks ', ranks);
    console.log('pointToRank ', userPoint.total_earnings,currentRank);
    const to_rank_id = currentRank  === 'Ambassador' && users_by_pk.rank_id !== 'Ambassador' ? 'Partner' : currentRank;
    console.log('from_rank_id ', users_by_pk.rank_id);
    console.log('to_rank_id ', to_rank_id);
    if (to_rank_id !== 'Ambassador') {
      if (to_rank_id !== users_by_pk.rank_id) {
        const result = await GraphqlAdmin.request<
          UpdateUserRankData,
          UpdateUserRankVars
        >(UPDATE_USER_RANK, {
          userId: userPoint?.user_id,
          current_point: userPoint.balance,
          total_earnings: userPoint.total_earnings,
          from_rank_id: users_by_pk.rank_id,
          to_rank_id: to_rank_id,
        });
        return res.json(result.insert_rank_histories_one);
      }
    }
    return res.json({message: 'No need update rank'});
  } catch (error) {
    console.error('auto_upgrade_rank_from_points', error);
    return res.json({message: error.message});
  }
};
