// authorizer middleware

import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../Errors/CustomError';
import { CustomRequest } from './verifyAccessToken';

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as CustomRequest).userId;
  console.log('user id is', userId);
  const { id } = req.params;
  console.log('id is', id);
  if (!userId || userId !== id) {
    throw new CustomError('Unauthorized, You do not have permission to access this resource', 401);
  }

  next();
};
