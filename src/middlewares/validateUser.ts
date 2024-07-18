import { Request, Response, NextFunction } from 'express';
import { userSignUpSchema, userSignInSchema } from '../Schema/User.schema';

export const validateUserSignUpData = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSignUpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateUserSignInData = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSignInSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
