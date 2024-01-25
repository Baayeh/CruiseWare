import * as jwt from 'jsonwebtoken';
import { UserInterface } from '../../utils/interfaces';

export { }


declare global {
  namespace Express {
    export interface Request {
      user: UserInterface | jwt.JwtPayload | any;
    }
    export interface Response {
      user: UserInterface | jwt.JwtPayload | any;
    }
  }
}