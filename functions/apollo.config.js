// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
module.exports = {
  client: {
    service: {
      name: 'loyalty-point',
      url: 'http://localhost:8080/v1/graphql',
      headers: {'x-hasura-admin-secret': `sun@2020`},
    },
    skipSSLValidation: true,
    excludes: ['node_modules/**/*'],
    includes: ['src/**/*.{ts,gql,tsx,js,jsx,graphql}'],
  },
};
