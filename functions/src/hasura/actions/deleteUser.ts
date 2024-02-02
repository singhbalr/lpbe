import {Response, Request} from 'express';
import GraphqlAdmin from '../../libs/graphql-admin';
import DELETE_USER from '../../schemas/delete-user';

export default async (req: Request, res: Response) => {
  const {session_variables}: Action<unknown> = req.body;
  const userId = session_variables!['x-hasura-user-id'];
  const email = `${Math.random().toString(36).substring(7)}@disable.com`;
  try {
    const {id} = await GraphqlAdmin.request(DELETE_USER, {
      id: userId,
      email: email,
    });
    return res.json({id});
  } catch (error) {
    return res.status(400).json({error});
  }
};
