// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import configs from '../libs/configs';

const functions = new Map<string, void | Promise<void>>();

const getFunction = async (src: string) => {
  const func = functions.get(src);
  if (func) {
    console.log(`${src} Func from cache`);
    return func;
  } else {
    console.log(`${src} Func is new`);
    const handler = await import(src);
    const defaultFunc = handler.default;
    functions.set(src, defaultFunc);
    return defaultFunc;
  }
};

exports.function = async (req: Request, res: Response) => {
  res.setHeader('X-SHA', configs.GITHUB_SHA);
  const returnError = (message: string) => {
    res.status(400).json({message});
  };
  if (req.path.startsWith('/healthz')) {
    return res.send('ok');
  }
  if (req.method !== 'POST') {
    return returnError('Denied');
  }
  try {
    const {action, trigger, name}: Payload = req.body;

    let src = '';

    if (action) {
      src = `./actions/${action.name}`;
    } else if (trigger) {
      src = `./triggers/${trigger.name}`;
    } else if (name) {
      src = `./crons/${name}`;
    } else {
      return returnError('Request are not actions or triggers');
    }

    const func = await getFunction(src);
    return await func(req, res);
  } catch (error) {
    console.log(error.message);
    returnError(error.message);
  }
};
