// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import GraphqlAdmin from '../../libs/graphql-admin';

import GET_RANKS_DATA, {
  UserRankData,
  UserRankVars,
} from '../../schemas/get_ranks_data';

import UPDATE_USER_RANK, {
  UpdateUserRankData,
  UpdateUserRankVars,
} from '../../schemas/update-user-rank';

import {pointToRank} from '../utils';

// interface Point {
//   id: string;
//   user_id: string;
//   balance: number;
//   total_earnings: number;
//   total_exchange: number;
// }

export default async (req: Request, res: Response) => {
  const {session_variables}: Action<unknown> = req.body;
  const userId = session_variables!['x-hasura-user-id'];

  try {
    const {users_by_pk, ranks} = await GraphqlAdmin.request<
      UserRankData,
      UserRankVars
    >(GET_RANKS_DATA, {userId: userId});

    const today = dayjs();
    console.log('users_by_pk', users_by_pk);
    console.log('ranks', ranks);

    const currentRank = pointToRank(users_by_pk.point.total_earnings, ranks);
    console.log('pointToRank ', users_by_pk.point.total_earnings, currentRank);
    if (currentRank === 'Ambassador' && users_by_pk.rank_id === 'Partner') {
      console.log('Need to upgrade ');
      await GraphqlAdmin.request<UpdateUserRankData, UpdateUserRankVars>(
        UPDATE_USER_RANK,
        {
          userId: userId,
          current_point: users_by_pk.point.balance,
          total_earnings: users_by_pk.point.total_earnings,
          from_rank_id: users_by_pk.rank_id,
          to_rank_id: currentRank,
          last_tested_at: today.toISOString(),
        }
      );
      return res.json({is_upgrade: true, current_rank_id: currentRank});
    }
    if (users_by_pk.rank_id === 'Ambassador') {
      let startPointAt;
      if (users_by_pk.last_tested_at) {
        startPointAt = dayjs(users_by_pk.last_tested_at);
      } else {
        if (
          users_by_pk.rank_histories &&
          users_by_pk.rank_histories.length > 0
        ) {
          const rankHistory = users_by_pk.rank_histories[0];
          if (rankHistory.to_rank_id === 'Ambassador') {
            startPointAt = dayjs(rankHistory.created_at);
          }
        }
      }
      if (startPointAt) {
        const DAY_CHECK = 60;
        const endPointAt = startPointAt.clone().add(60,'day');
        if (today.isAfter(endPointAt)) {
          
        }
      }
    }

    return res.json({is_upgrade: false, current_rank_id: users_by_pk.rank_id});
  } catch (error) {
    return res.status(400).json({message: 'UPGRADE_ERROR'});
  }
};
