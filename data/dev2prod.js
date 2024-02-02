// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
var AWS = require("aws-sdk");
var R = require("ramda");
const { GraphQLClient, gql } = require("graphql-request");
const { Headers } = require("cross-fetch");
global.Headers = global.Headers || Headers;

AWS.config.region = "";

const from = {
  userPoolId: "",
  users: [
    {
      uid: "",
      email: "",
      point: 0,
    },
  ],
};

const to = {
  userPoolId: "",
  graphql: "",
  secretKey: "",
  point_share_id: "",
};

const cognito = new AWS.CognitoIdentityServiceProvider();

const getAttributeValue = (name, attrs) => {
  return R.find(R.propEq("Name", name))(attrs).Value;
};

const getUser = (uid, poolID) => {
  return new Promise((resolve, reject) => {
    cognito.adminGetUser(
      {
        UserPoolId: poolID,
        Username: uid,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const createUser = (UserAttributes) => {
  return new Promise((resolve, reject) => {
    cognito.adminCreateUser(
      {
        UserPoolId: to.userPoolId,
        Username: getAttributeValue("email", UserAttributes),
        UserAttributes: UserAttributes,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

(async () => {
  for (var i = 0; i < from.users.length; i++) {
    const result = await getUser(from.users[i].uid, from.userPoolId);
    const Username = result.Username;
    const UserAttributes = result.UserAttributes;

    const newUserAttributes = UserAttributes.filter((i) => i.Name !== "sub");

    console.log(`result ${Username} ->`, newUserAttributes);

    let newUserId;

    try {
      const resultNewUser = await createUser(newUserAttributes);
      console.log(`resultNewUser`, resultNewUser);
      newUserId = resultNewUser.User.Username;
    } catch (error) {
      console.log(`resultNewUsers error`, error.message);
      return;
    }

    // Call sync
    const syncClient = new GraphQLClient(to.graphql, {
      headers: {
        "x-hasura-admin-secret": to.secretKey,
        "x-hasura-role": "user",
        "x-hasura-user-id": `${newUserId}`,
      },
    });

    const SYNC = gql`
      mutation {
        syncMe {
          me {
            name
            email
          }
          user_id
        }
      }
    `;

    try {
      const data = await syncClient.request(SYNC);
      console.log(`SYNC data `, data);
    } catch (error) {
      console.log(`SYNC data `, error.message);
      return;
    }

    const POINT = gql`
      mutation collectPoint($point: Int!, $point_shares_id: uuid!) {
        collectPoint(point: $point, point_shares_id: $point_shares_id) {
          balance
        }
      }
    `;
    if (from.users[i].point > 0) {
      try {
        const data = await syncClient.request(POINT, {
          point: from.users[i].point,
          point_shares_id: to.point_share_id,
        });
        console.log(`SYNC point `, data);
      } catch (error) {
        console.log(`SYNC point `, error.message);
        return;
      }
    }
  }
})();
