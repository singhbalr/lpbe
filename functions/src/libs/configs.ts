// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
export default {
  GITHUB_SHA: process.env.GITHUB_SHA || '',
  AWS: {
    region: process.env.AWS_REGION || '',
    userPoolId: process.env.AWS_USER_POOL_ID || '',
  },
  HASURA: {
    graphqlUrl: process.env.HASURA_GRAPHQL_URL || '',
    adminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET || '',
  }
};
