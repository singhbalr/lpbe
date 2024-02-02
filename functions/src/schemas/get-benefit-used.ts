// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {gql} from 'graphql-request';
import {ExchangeType} from './model';
export default gql`
  query GetBenefitUsed($user_id: String!) {
    exchange_products(
      where: {
        _not: {exchange_type_id: {_in: [AMBASSADOR, POINT]}}
        exchange: {user_id: {_eq: $user_id}}
      }
      distinct_on: exchange_type_id
      limit: 2
    ) {
      exchange_type_id
    }
  }
`;

export interface BenefitVars {
  user_id: string;
}

export interface BenefitData {
  exchange_products: Array<{exchange_type_id: ExchangeType}> | null;
}
