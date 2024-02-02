// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import R from 'ramda';

import GraphqlAdmin from '../../libs/graphql-admin';
import GET_PRODUCTS_FROM_LIST, {
  ProductData,
  ProductVars,
  Product,
} from '../../schemas/get-products-from-list';
import GET_DOEXCHANGE_DATA, {
  UserExchangeData,
  UserExchangeVars,
} from '../../schemas/get-doexchange-data';
import DO_EXCHANGES, {
  ExchangeVars,
  ExchangeData,
} from '../../schemas/do-exchanges';
import {ExchangeType, TransactionType} from '../../schemas/model';

import {getBenefitUsed} from './getBenefitUsed';

interface ExchangeInput {
  product_id: string;
  exchange_type: ExchangeType;
  amount: number;
  product?: Product | undefined;
}

interface Input {
  exchangeInputs: ExchangeInput[];
  restaurant_id: string;
}

export default async (req: Request, res: Response) => {
  const {session_variables, input}: Action<Input> = req.body;

  try {
    const userId = session_variables!['x-hasura-user-id'];

    const {
      can_get_ambassador_benefit,
      can_get_install_benefit,
      can_get_bonus_install_benefit,
    } = await getBenefitUsed(userId);

    const dResult = await GraphqlAdmin.request<
      UserExchangeData,
      UserExchangeVars
    >(GET_DOEXCHANGE_DATA, {userId});

    const {users_by_pk: user} = dResult;

    const pResult = await GraphqlAdmin.request<ProductData, ProductVars>(
      GET_PRODUCTS_FROM_LIST,
      {ids: input!.exchangeInputs!.map(i => i.product_id)}
    );

    //console.log('pResult', pResult.products);

    const exchangeProducts = R.map(
      o => ({
        ...o,
        product: R.find<Product>(R.propEq('id', o.product_id))(
          pResult.products
        ),
      }),
      input!.exchangeInputs
    );

    //console.log('exchangeProducts', exchangeProducts);

    const inputErrs = R.filter<ExchangeInput>(
      o => R.isNil(o.product) || o.amount < 1,
      exchangeProducts
    );

    console.log('inputErrs', inputErrs);

    if (!R.isEmpty(inputErrs)) {
      return res.status(400).json({
        message: 'EXCHANGE_INPUT_ERROR',
      });
    }

    if (exchangeProducts.length > 100) {
      return res.status(400).json({
        message: 'EXCHANGE_LIMIT_AT_TIME',
      });
    }

    const exchangeVars: ExchangeVars = {
      user_id: userId,
      exchangeProducts: [],
      restaurant_id: input?.restaurant_id!
    };

    const pointProducts = R.filter<ExchangeInput>(
      o =>
        o.exchange_type === ExchangeType.POINT && o.product!.is_exchange_point,
      exchangeProducts
    );

    const installProducts = R.filter<ExchangeInput>(
      o =>
        o.exchange_type === ExchangeType.INSTALL &&
        o.product!.is_exchange_install,
      exchangeProducts
    );

    const bonusInstallProducts = R.filter<ExchangeInput>(
      o =>
        o.exchange_type === ExchangeType.BONUS_INSTALL &&
        o.product!.is_exchange_bonus_install,
      exchangeProducts
    );

    const ambassadorProducts = R.filter<ExchangeInput>(
      o =>
        o.exchange_type === ExchangeType.AMBASSADOR &&
        o.product!.is_exchange_ambassador,
      exchangeProducts
    );

    // 1. Check

    // 1.a Check point

    if (!R.isEmpty(pointProducts)) {
      const totalPoints = R.reduce(
        R.subtract,
        0,
        pointProducts.map(o => o.product?.exchange_point! * o.amount)
      );
      if (totalPoints * -1 > user.point.balance) {
        console.log(
          `User balance: ${user.point.balance}, Exchange points: ${
            totalPoints * -1
          }`
        );
        return res.status(400).json({message: 'POINT_NOT_ENOUGH'});
      }
      exchangeVars.total_points = totalPoints;
      exchangeVars.point_transaction = {
        data: {
          user_id: userId,
          amount: totalPoints,
          type_id: TransactionType.EXCHANGE,
        },
      };
      R.forEach<ExchangeInput>(
        o =>
          exchangeVars.exchangeProducts.push({
            product_id: o.product_id,
            exchange_type_id: o.exchange_type,
            extras: JSON.parse(JSON.stringify(o.product)),
            amount: o.amount,
          }),
        pointProducts
      );
    }

    // 1.b Check ambassadorProducts

    if (!R.isEmpty(ambassadorProducts)) {
      if (user.rank_id !== 'Ambassador') {
        return res.status(400).json({message: 'YOU_NEED_RANK_AMBASSADOR'});
      } else if (
        !can_get_ambassador_benefit ||
        ambassadorProducts.length > 1 ||
        ambassadorProducts[0].amount > 1
      ) {
        return res.status(400).json({message: 'LIMIT_AMBASSADOR_BENEFIT'});
      }
      R.forEach<ExchangeInput>(
        o =>
          exchangeVars.exchangeProducts.push({
            product_id: o.product_id,
            exchange_type_id: o.exchange_type,
            extras: JSON.parse(JSON.stringify(o.product)),
            amount: o.amount,
          }),
        ambassadorProducts
      );
    }

    // 1.b Check installProducts

    console.log('installProducts', installProducts);
    console.log('exchangeProducts', exchangeProducts);

    if (!R.isEmpty(installProducts)) {
      if (
        !can_get_install_benefit ||
        installProducts.length > 1 ||
        installProducts[0].amount > 1
      ) {
        return res.status(400).json({message: 'LIMIT_INSTALL_BENEFIT'});
      }
      R.forEach<ExchangeInput>(
        o =>
          exchangeVars.exchangeProducts.push({
            product_id: o.product_id,
            exchange_type_id: o.exchange_type,
            extras: JSON.parse(JSON.stringify(o.product)),
            amount: o.amount,
          }),
        installProducts
      );
    }

    // 1.c Check bonusInstallProducts

    if (!R.isEmpty(bonusInstallProducts)) {
      if (
        !can_get_bonus_install_benefit ||
        bonusInstallProducts.length > 1 ||
        bonusInstallProducts[0].amount > 1
      ) {
        return res.status(400).json({message: 'LIMIT_BONUS_INSTALL_BENEFIT'});
      }
      R.forEach<ExchangeInput>(
        o =>
          exchangeVars.exchangeProducts.push({
            product_id: o.product_id,
            exchange_type_id: o.exchange_type,
            extras: JSON.parse(JSON.stringify(o.product)),
            amount: o.amount,
          }),
        bonusInstallProducts
      );
    }

    // 2. Insert to db
    console.log('exchangeVars', exchangeVars);
    if (exchangeVars.exchangeProducts.length > 0) {
      const exResult = await GraphqlAdmin.request<ExchangeData, ExchangeVars>(
        DO_EXCHANGES,
        exchangeVars
      );
      return res.json({exchange_id: exResult.insert_exchanges_one.id});
    } else {
      return res.status(400).json({message: 'ERR_INPUT_PRODUCT'});
    }

    //return res.json({exchange_id: 'f3f3ef41-b669-48f0-a7bf-e53ca8fdc40f'});
  } catch (error) {
    console.error(error);
    if (error.message.indexOf('insert or update on table "exchanges" violates foreign key constraint "exchanges_restaurant_id_fkey"') >= 0) {
      return res.status(400).json({message: 'ERR_INPUT_RESTAURANT'});
    }
    return res.status(400).json({message: 'EXCHANGE_ERROR'});
  }
};
