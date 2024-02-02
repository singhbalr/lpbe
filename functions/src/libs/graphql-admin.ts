// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {GraphQLClient} from 'graphql-request';
import {Headers} from 'cross-fetch';
import Configs from './configs'

global.Headers = global.Headers || Headers;

const graphQLClient = new GraphQLClient(Configs.HASURA.graphqlUrl);

graphQLClient.setHeaders({
  'x-hasura-admin-secret': Configs.HASURA.adminSecret,
});

export default graphQLClient