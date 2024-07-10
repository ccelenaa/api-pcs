import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import {getEnv} from './tools';


export default () => {
  return yaml.load(
    readFileSync(join(__dirname, `./../../config/${getEnv()}.yaml`), 'utf8'),
  ) as Record<string, any>;
};
