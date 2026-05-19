import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { ApiError } from '../middlewares/errorMiddleware';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError('User already exists', 400));
    }

    const user = await User.create({
      email,
      password,
      role: role || 'Sales',
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          token: generateToken((user._id as any).toString(), user.role),
        },
      });
    } else {
      next(new ApiError('Invalid user data', 400));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          token: generateToken((user._id as any).toString(), user.role),
        },
      });
    } else {
      next(new ApiError('Invalid email or password', 401));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      next(new ApiError('User not found', 404));
    }
  } catch (error) {
    next(error);
  }
};
