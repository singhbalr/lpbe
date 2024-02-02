# Overview Graphql

Use [Hasura Engine](https://hasura.io/) transform Postgres to Graphql Schema. It's support CURD, Websocket and more.

1. [Graphql](#1-graphql)

2. [Custom Action](#2-Custom-action)

3. [Trigger](#3-Trigger)



With Custom Action and Trigger when call to service `functions` (is Node JS app)

## 1. Schema

> The Hasura GraphQL engine automatically generates your GraphQL schema and resolvers based on your tables/views in Postgres. **You don’t need to write a GraphQL schema or resolvers.** See [How Hasura GraphQL engine works](https://hasura.io/docs/1.0/graphql/core/how-it-works/index.html#how-it-works) for more details.
> 
> The Hasura console gives you UI tools that speed up your data-modelling process, or working with your existing database. The console also automatically generates migrations or metadata files that you can edit directly and check into your version control.
> 
> The Hasura GraphQL engine lets you do anything you would usually do with Postgres by giving you GraphQL over native Postgres constructs.

Individual schema for each Roles. Using any Graphql PlayGround, IDE ... include authen token to get schema and try Graphql.

Using `ADMIN SECRET` to get full Graphql Schema via `hasura-cli` or others Graphql Tools (with Http Header)



## 2. Custom Action

See [Actions | Hasura GraphQL Docs](https://hasura.io/docs/1.0/graphql/core/actions/index.html)



See [config file](../hasura/metadata/actions.yaml)

#### Query

- `getBenefitUsed` : Get Benefits Info
  
  ```graphql
  type BenefitOutput {
    can_get_ambassador_benefit: Boolean # Can get ambassador benefit ?
    can_get_install_benefit: Boolean # Can get install benefit ?
    can_get_bonus_install_benefit: Boolean # Can get bonus install benefit ?
    can_show_test: Boolean # Can show test ? -> IQ test for extension of Ambassador time
  }
  ```

- `getCheckin`: Get Check-in info
  
  ```graphql
  type Query {
    getCheckin(
      restaurant_id: uuid! # ID restaurant
    ): GetCheckinOutput
  }
  
  type GetCheckinOutput {
    is_today_checkin: Boolean! # Is today check-in ?
    point: Int! # amount point can get when check-in
  }
  ```

- `getPointExpire` Get Point Expire
  
  ```graphql
  type Query {
    getPointExpire : PointExpireOutput
  }
  
  type PointExpireOutput {
    expired_at : timestamptz!  # Time of expiration
    is_expired : Boolean! # Has expired or not
  }
  ```

#### Mutation

- `doCheckin`: Action check-in Restaurant with Lon,Lat

```graphql
type Mutation {
  doCheckin (
    checkinInput: DoCheckinInput!
  ): DoCheckinOutput
}
input DoCheckinInput {
  restaurant_id : String!
  lon : Float!
  lat : Float!
}

type DoCheckinOutput {
  amount : Int!
  created_at : timestamptz!
}
```

- `doExchanges`: Exchange product with point or benefit 

```graphql
type Mutation {
  doExchanges (
    exchangeInputs: [ExchangeInput!]!
    restaurant_id: uuid!
  ): doExchangesOutput
}

input ExchangeInput {
  product_id : uuid!
  exchange_type : ExchangeType!
  amount : Int!
}

enum ExchangeType {
  POINT
  AMBASSADOR
  INSTALL
  BONUS_INSTALL
}

type doExchangesOutput {
  exchange_id : uuid!
}
```

- `collectPoint`: To Collect point from Qrcode

```graphql
type Mutation {
  collectPoint (
    point_shares_id: uuid! # point_shares_id is Qrcode Value
    point: Int! # amount point need collect
  ): CollectPointOutput
}

type CollectPointOutput {
  point_collects_id : uuid!
  balance : Int!
  points : Int!
}
```

- `syncMe`: Sync Aws Cognito user profile to DB

```graphql
type Mutation {
  syncMe : SyncMeOutput
}
type SyncMeOutput {
  updated_at : timestamptz!
  user_id : String!
}
```

- `upAmbassador`: Up rank to Ambassador when IQ tested 

```graphql
type Mutation {
  upAmbassador : UpAmbassadorOutput!
}
type UpAmbassadorOutput {
  current_rank_id : String!
  is_upgrade : Boolean!
}
```

- `staffLogin` Staff login 

```graphql
type Mutation {
  staffLogin (
    pin: Int!
  ): StaffLoginOutput
}
type StaffLoginOutput {
  token : String!
}
```

- `staffCreateQrcode`: Create Qr Code for Staff App
  
  Header Var
  
  - `x-hasura-restaurant-token` : from staff login

```graphql
type Mutation {
  staffCreateQrcode (
    points: Int!
  ): QrcodeOutput
}
type QrcodeOutput {
  point_shares_id : uuid!
  points : Int!
}
```

## 3. Trigger

See [Event Triggers | Hasura GraphQL Docs](https://hasura.io/docs/1.0/graphql/core/event-triggers/index.html)



#### Event Triggers

- [auto_upgrade_rank_from_points](../hasura/metadata/tables.yaml#L289) :  Listent from `points` table: INSERT, UPDATE

- [give_away_point_when_register](../hasura/metadata/tables.yaml#L587): Listent from `users` table: INSERT

- [send_email_welcome](../hasura/metadata/tables.yaml#L587): Listent from `users` table: INSERT



#### Cron Triggers

    - `auto_remove_rank_point`: Automatically downgrading and reset points to starting. when there is no gain activity for a month.
