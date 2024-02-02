#!/bin/bash

file=$(pwd)/$1/kustomization.yaml
awsfile=$(pwd)/$1/credentials

# For k8s
sed -i 's|<FUNCTIONS_IMAGE>|'$FUNCTIONS_IMAGE'|' $file
sed -i 's|<FUNCTIONS_TAG>|'$FUNCTIONS_TAG'|' $file
sed -i 's|<APP_IMAGE>|'$APP_IMAGE'|' $file
sed -i 's|<APP_TAG>|'$APP_TAG'|' $file
sed -i 's|<HASURA_GRAPHQL_DATABASE_URL>|'$HASURA_GRAPHQL_DATABASE_URL'|' $file
sed -i 's|<HASURA_GRAPHQL_ADMIN_SECRET>|'$HASURA_GRAPHQL_ADMIN_SECRET'|' $file
sed -i 's|<HASURA_GRAPHQL_JWT_SECRET>|'$HASURA_GRAPHQL_JWT_SECRET'|' $file
sed -i 's|<HASURA_GRAPHQL_URL>|'$HASURA_GRAPHQL_URL'|' $file

# For aws credentials
sed -i 's|<AWS_ACCESS_KEY_ID>|'$AWS_ACCESS_KEY_ID'|' $awsfile
sed -i 's|<AWS_SECRET_ACCESS_KEY>|'$AWS_SECRET_ACCESS_KEY'|' $awsfile

# sed -i 's|<STORAGE_ENDPOINT>|'$STORAGE_ENDPOINT'|' $file
# sed -i 's|<STORAGE_BUCKET_NAME>|'$STORAGE_BUCKET_NAME'|' $file
# sed -i 's|<STORAGE_ACCESS_KEY>|'$STORAGE_ACCESS_KEY'|' $file
# sed -i 's|<STORAGE_SECRET_KEY>|'$STORAGE_SECRET_KEY'|' $file