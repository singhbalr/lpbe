// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import * as AWS from 'aws-sdk';
import Configs from './configs';

console.log('Configs Cognito : ', Configs.AWS);

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: Configs.AWS.region,
});

const s3 = new AWS.S3({region: Configs.AWS.region});
const lambda = new AWS.Lambda();

export const getUser = (
  id: string
): Promise<AWS.CognitoIdentityServiceProvider.Types.AdminGetUserResponse> => {
  const params: AWS.CognitoIdentityServiceProvider.Types.AdminGetUserRequest = {
    UserPoolId: Configs.AWS.userPoolId,
    Username: id,
  };
  return new Promise((resolve, reject) => {
    cognito.adminGetUser(params, (err, data) => {
      if (err) reject(err);
      else {
        resolve(data);
      }
    });
  });
};

export const exitsFile = (key: string) => {
  return s3
    .headObject({Bucket: 'loyalty-static-content-stg', Key: `files/${key}`})
    .promise();
};

export const uploadFile = (file: Buffer, key: string) => {
  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: 'loyalty-static-content-stg',
    Key: `files/${key}`,
    Body: file,
    ContentType: 'image/jpg',
    ACL: 'public-read',
  };
  return s3.upload(params).promise();
};

export const sendEmailWelcome = async (email: string, name: string) => {
  const params: AWS.Lambda.Types.InvokeAsyncRequest = {
    FunctionName: process.env.LAMBDA_FUNC_SEND_EMAIL_WELCOME || '',
    InvokeArgs: JSON.stringify({email, name}),
  };
  const {$response} = await lambda.invokeAsync(params).promise();
  if ($response.error) {
    return null;
  }
  return $response.data;
};
