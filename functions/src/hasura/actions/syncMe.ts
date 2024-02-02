// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import R from 'ramda';

import {getUser} from '../../libs/aws-admin';
import GraphqlAdmin from '../../libs/graphql-admin';

import USER_EXITS from '../../schemas/user-exits';
import CREATE_USER from '../../schemas/create-user';
import UPDATE_USER from '../../schemas/update-user';
import INIT_POINT from '../../schemas/create-init-point';

dayjs.extend(utc);

interface CheckVars {
  user_id: string;
}

interface UpsetUserVars {
  id: string;
  gender_id?: string;
  name?: string;
  email: string;
  birthdate?: string;
  restaurant_id?: string | null;
}

interface User {
  id: string;
  updated_at?: string;
  point?: {
    id: string;
  };
}

interface UserExitsResponse {
  users_by_pk: User | null;
}

interface UserCreateResponse {
  insert_users_one: User | null;
}

interface UserUpdateResponse {
  update_users_by_pk: User | null;
}

interface AttributeType {
  Name: string;
  Value?: string;
}

const getAttributeValue = (name: string, attrs: any) => {
  return R.find<AttributeType>(R.propEq('Name', name))(attrs)?.Value;
};

export default async (req: Request, res: Response) => {
  const {session_variables}: Action<unknown> = req.body;

  const userId = session_variables!['x-hasura-user-id'];
  if (userId) {
    try {
      const userAws = await getUser(userId);
      const userAttributes = userAws.UserAttributes;
      const resultExits = await GraphqlAdmin.request<
        UserExitsResponse,
        CheckVars
      >(USER_EXITS, {
        user_id: userId,
      });

      console.log('userAttributes', userAttributes);

      const gender = getAttributeValue('gender', userAttributes);

      const userVars: UpsetUserVars = {
        id: userId,
        name: getAttributeValue('name', userAttributes)!,
        email: getAttributeValue('email', userAttributes)!,
        gender_id: !gender ? undefined : gender.toUpperCase(),
        birthdate: getAttributeValue('birthdate', userAttributes)!,
        restaurant_id: getAttributeValue(
          'customer:restaurant_id',
          userAttributes
        ),
      };

      const userVarsCombine: UpsetUserVars = R.reject(R.isNil)(userVars);
      console.log('userVars', userVarsCombine);

      if (!resultExits.users_by_pk) {
        // Create User
        const resultCreate = await GraphqlAdmin.request<
          UserCreateResponse,
          UpsetUserVars
        >(CREATE_USER, {
          ...userVarsCombine,
        });
        if (resultCreate && resultCreate.insert_users_one) {
          await GraphqlAdmin.request(INIT_POINT, {user_id: userId});
          return res.json({
            updated_at: resultCreate.insert_users_one.updated_at,
            user_id: userId,
          });
        } else {
          return res.status(400).json({message: 'SYNC_ERROR'});
        }
      } else {
        // Create point if not exits
        if (!resultExits.users_by_pk.point) {
          console.log('Create point if not exits');
          await GraphqlAdmin.request(INIT_POINT, {user_id: userId});
        }

        // Update User
        const resultUpdate = await GraphqlAdmin.request<
          UserUpdateResponse,
          UpsetUserVars
        >(UPDATE_USER, {
          ...userVarsCombine,
        });
        if (resultUpdate.update_users_by_pk) {
          return res.json({
            updated_at: resultUpdate.update_users_by_pk.updated_at,
            user_id: userId,
          });
        } else {
          return res.status(400).json({message: 'SYNC_ERROR'});
        }
      }
    } catch (error) {
      console.log('syncMe error', error);
      return res.status(400).json({message: 'USER_NOT_FOUND'});
    }
  } else {
    return res.status(400).json({message: 'USER_NOT_FOUND'});
  }
};
