// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
export enum TransactionType {
  CHECKIN = 'CHECKIN',
  EXCHANGE = 'EXCHANGE',
  INSTALL = 'INSTALL',
  COLLECT = 'COLLECT',
  ROLLBACK = 'ROLLBACK'
}

export enum ExchangeType {
  POINT = 'POINT',
  AMBASSADOR = 'AMBASSADOR',
  INSTALL = 'INSTALL',
  BONUS_INSTALL = 'BONUS_INSTALL',
}

export enum RankType {
  Mate = 'Mate',
  BestFriend = 'Best Friend',
  Partner = 'Partner',
  Ambassador = 'Ambassador',
}

export interface InsertPointTransactionVars {
  amount: number;
  type_id: TransactionType;
  user_id: string;
}
