import axios from 'axios';
import { Request, Response } from 'express';
import User from '../models/userModel';

const tokenUrl = 'https://api.dropbox.com/oauth2/token';
const redirectUri = 'http://localhost:4000/auth/callback';
const authUrl = 'https://www.dropbox.com/oauth2/authorize';

export const authCallback = async (req: Request, res: Response) => {
	const { code } = req.query;
  
	try {
	  const response = await axios.post(tokenUrl, new URLSearchParams({
		code: code as string,
		grant_type: 'authorization_code',
		redirect_uri: redirectUri
	  }), {
		auth: {
		  username: process.env.DROPBOX_APP_KEY!,
		  password: process.env.DROPBOX_APP_SECRET!
		}
	  });
  
	  const { access_token, expires_in, account_id } = response.data;
  
	  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
	  const tokenExpiresAtInSeconds = currentTimeInSeconds + expires_in;
  
	  const user = await User.findOneAndUpdate(
		{ accountId: account_id.replace('dbid:', '') },
		{
		  token: access_token,
		  expires_in: tokenExpiresAtInSeconds,
		},
		{ new: true, upsert: true }
	  );
  
	  const clientRedirectUri = `http://localhost:3000?accountId=${user?.accountId}&access_token=${access_token}`;
	  res.redirect(clientRedirectUri);
	} catch (error) {
	  console.error('Error exchanging code for access token:', error);
	  res.status(500).send('Error exchanging code for access token');
	}
}

export const authRedirect = (req: Request, res: Response) => {
	const authUrlWithParams = `${authUrl}?client_id=${process.env.DROPBOX_APP_KEY}&response_type=code&redirect_uri=${redirectUri}`;
	res.redirect(authUrlWithParams);
}