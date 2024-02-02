// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
import {Response, Request} from 'express';
import fs from 'fs';
import path from 'path';

import {exitsFile, uploadFile} from '../libs/aws-admin';

const FOLDER = path.join(__dirname,'../../../images');

exports.function = async (req: Request, res: Response) => {
  fs.readdir(FOLDER, async (err, files) => {
    if (err) {
      console.error(err);
    } else {
      //console.log('files', files);
      const length = files.length;
      let count = 0;
      for (let i = 0; i < length; i++) {
        const file = files[i];
        //await fs.renameSync(path.join(FOLDER,file), path.join(FOLDER,file.replace('.jpg','')));
        if (file === '.DS_Store') {
            continue;
        }
        try {
          await exitsFile(file);
          continue;
        } catch (error) {}
        const fileRead = fs.readFileSync(path.join(FOLDER, file));
        try {
          await uploadFile(fileRead, file);
          console.log('Uploaded ' + file);
          count++
        } catch (error) {
          console.error(error);
        }
      }
      console.log(`Uploaded ${count} files`);
      res.send(`Uploaded ${count} files`)
    }
  });
};
