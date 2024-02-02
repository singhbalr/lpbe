#!/bin/bash

## Env for Dev only
HASURA_GRAPHQL_DATABASE_URL=postgres://dev_loyalty:loyaltydev2020@10.0.4.18:5432/devdb_loyalty
HASURA_GRAPHQL_ADMIN_SECRET=loyalty-point-dev@2020
HASURA_GRAPHQL_JWT_SECRET={"type":"RS256","jwk_url":"https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_9KjFBOutl/.well-known/jwks.json","claims_format":"stringified_json"}

file=./dev/kustomization.yaml

sed -i -e 's|<HASURA_GRAPHQL_DATABASE_URL>|'$HASURA_GRAPHQL_DATABASE_URL'|' $file
sed -i -e 's|<HASURA_GRAPHQL_ADMIN_SECRET>|'$HASURA_GRAPHQL_ADMIN_SECRET'|' $file
sed -i -e 's|<HASURA_GRAPHQL_JWT_SECRET>|'$HASURA_GRAPHQL_JWT_SECRET'|' $file

kubectl apply -k dev