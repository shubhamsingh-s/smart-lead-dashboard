import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { ApiError } from './errorMiddleware';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  id: string;
  role: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new ApiError('Not authorized, user not found', 401));
      }
      req.user = user;
      next();
    } catch (error) {
      next(new ApiError('Not authorized, token failed', 401));
    }
  } else {
    next(new ApiError('Not authorized, no token', 401));
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    next(new ApiError('Not authorized as an admin', 403));
  }
};
