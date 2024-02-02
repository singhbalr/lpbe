// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import GraphqlAdmin from '../../libs/graphql-admin';

import GET_RANKS_DATA, {
  UserRankData,
  UserRankVars,
} from '../../schemas/get_ranks_data';
import GET_AMBASSADOR_USED, {
  Vars,
  Data,
} from '../../schemas/get-ambassador-used';

import GET_BENEFIT_USED, {
  BenefitData,
  BenefitVars,
} from '../../schemas/get-benefit-used';

import GET_FIRST_EARN_POINT, {
  FirstEarnPointData,
  FirstEarnPointVars,
} from '../../schemas/get-first-earn-point';

import {ExchangeType} from '../../schemas/model';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Output {
  can_get_ambassador_benefit: boolean;
  can_get_install_benefit: boolean;
  can_get_bonus_install_benefit: boolean;
  can_show_test: boolean;
}

export const getBenefitUsed = async (userId: string): Promise<Output> => {
  const {users_by_pk: user, ranks} = await GraphqlAdmin.request<
    UserRankData,
    UserRankVars
  >(GET_RANKS_DATA, {userId});

  const today = dayjs();
  const todayTokyo = dayjs().tz('Asia/Tokyo');
  const startDayTokyo = todayTokyo.clone().set('h',0).set('m',0).set('s',0).set('ms',0);
  const endDayTokyo = todayTokyo.clone().set('h',23).set('m',59).set('s',59).set('ms',999);

  console.log('todayTokyo ', todayTokyo.format())
  console.log('startDayTokyo ', startDayTokyo.format())
  console.log('endDayTokyo ', endDayTokyo.format())

  let can_show_test = false;
  let can_get_ambassador_benefit = false;
  let can_get_install_benefit = false;
  let can_get_bonus_install_benefit = false;

  if (user.rank_id === 'Ambassador') {
    const rankHistory =
      user.rank_histories && user.rank_histories?.length > 0
        ? user.rank_histories[0]
        : null;
    if (rankHistory) {
      const dateUpAmbassador = dayjs(
        user.last_tested_at || rankHistory.created_at
      );
      
      console.log('dateUpAmbassador', dateUpAmbassador.toISOString());
      const sixMonthAgo = dateUpAmbassador.clone().add(6, 'month');
      console.log('sixMonthAgo', sixMonthAgo.toISOString());

      const {
        point_transactions_aggregate,
        exchange_products_aggregate,
      } = await GraphqlAdmin.request<Data, Vars>(GET_AMBASSADOR_USED, {
        user_id: userId,
        endDateAmbassador: dateUpAmbassador.toISOString(),
        todayStart: startDayTokyo.toISOString(), 
        todayEnd: endDayTokyo.toISOString()
      });

      if (today.isAfter(sixMonthAgo)) {
        console.log('is sixMonthAgo');
        // Tra loi cau hoi
        if (
          !!point_transactions_aggregate.aggregate.sum.amount &&
          point_transactions_aggregate.aggregate.sum.amount >= 100
        ) {
          can_show_test = true;
        }
      } else {
        console.log("isn't sixMonthAgo");
        can_get_ambassador_benefit =
          exchange_products_aggregate.aggregate.count === 0;
      }
    }
  } else {
    const rankAmbassador = ranks[ranks.findIndex(v => v.id === 'Ambassador')];
    if (
      user.rank_id === 'Partner' &&
      user.point.total_earnings >= rankAmbassador.from_point!
    ) {
      can_show_test = true;
    }
  }

  const {exchange_products} = await GraphqlAdmin.request<
    BenefitData,
    BenefitVars
  >(GET_BENEFIT_USED, {
    user_id: userId,
  });

  console.log('exchange_products', exchange_products);

  can_get_install_benefit =
    !exchange_products ||
    exchange_products.findIndex(
      i => i.exchange_type_id === ExchangeType.INSTALL
    ) < 0;

  if (
    !exchange_products ||
    exchange_products.findIndex(
      i => i.exchange_type_id === ExchangeType.BONUS_INSTALL
    ) < 0
  ) {
    // Next step
    const {point_transactions} = await GraphqlAdmin.request<
      FirstEarnPointData,
      FirstEarnPointVars
    >(GET_FIRST_EARN_POINT, {user_id: userId});
    if (!!point_transactions && point_transactions.length > 0) {
      const transaction = point_transactions[0];
      const firstTransactionAt = dayjs(transaction.created_at).tz('Asia/Tokyo');
      const startBonusAt =  firstTransactionAt.clone().add(1,'day').set('h',17).set('m',30).set('s',0).set('ms',0);
      const endBonusAt = startBonusAt.clone().add(2, 'week');
      console.log('first transaction at', firstTransactionAt.format());
      console.log('start bonus at', startBonusAt.format());
      console.log('end bonus at', endBonusAt.format());
      console.log('today at', today.tz('Asia/Tokyo').format());
      if (today.isAfter(startBonusAt) && today.isBefore(endBonusAt)) {
        can_get_bonus_install_benefit = true;
      }
    }
  }

  const output: Output = {
    can_get_ambassador_benefit,
    can_get_install_benefit,
    can_get_bonus_install_benefit,
    can_show_test: can_show_test,
  };
  return output;
};

export default async (req: Request, res: Response) => {
  const {session_variables}: Action<unknown> = req.body;
  const userId = session_variables!['x-hasura-user-id'];

  try {
    const output = await getBenefitUsed(userId);
    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error.message});
  }
};
