import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import axios from 'axios';
import { Dropbox, files } from 'dropbox';

const checkTokenExpiration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      accessToken = typeof req.query.accessToken === 'string' ? req.query.accessToken : undefined;
    }

    if (!accessToken) {
      accessToken = typeof req.body.accessToken === 'string' ? req.body.accessToken : undefined;
    }

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    const dbx = new Dropbox({ accessToken });
    const user = await dbx.usersGetCurrentAccount();

    next();
  } catch (error) {
    const err = error as any;

    if (err.status === 401) {
      return res.status(401).json({ message: 'Access token is invalid or expired' });
    }
    console.error('Error checking token validity:', err);
    return res.status(500).json({ message: 'Error checking token validity' });
  }
};

export default checkTokenExpiration;