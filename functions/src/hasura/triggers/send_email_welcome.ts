// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import {sendEmailWelcome} from '../../libs/aws-admin';

interface User {
  id: string;
  birthdate?: Date;
  email: string;
  gender_id?: string;
  name?: string;
  restaurant_id?: string;
}

export default async (req: Request, res: Response) => {
  const {event, trigger}: EventTrigger<User> = req.body;
  const newUser = event.data.new as User;
  const oldUser = event.data.old as User;
  if (
    !!newUser.birthdate &&
    !!newUser.gender_id &&
    !!newUser.name &&
    (!oldUser || (!oldUser.gender_id && !oldUser.birthdate && !oldUser.name))
  ) {
    console.log('Send email welcome');
    try {
      const data = await sendEmailWelcome(newUser.email, newUser.name);
      return res.json({message: 'Send email welcome success', data});
    } catch (error) {
      return res.json({message: 'Send email error', error});
    }
  }
  return res.json({message: 'No need send email'});
};
