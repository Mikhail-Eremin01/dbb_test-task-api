import axios from 'axios';
import { Dropbox } from 'dropbox';
import { Request, Response } from 'express';

export const deleteFiles = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers['authorization'];
		console.log("authHeader: ", authHeader)
		if (!authHeader) {
		return res.status(400).json({ message: 'Authorization header missing' });
		}
    	const accessToken = authHeader.replace('Bearer ', '');
		console.log("accessToken: ", accessToken)

		const { paths } = req.body;

		if (!accessToken || !paths || !Array.isArray(paths)) {
			return res.status(400).json({ message: 'Invalid input' });
		}
		const dbx = new Dropbox({ accessToken: accessToken as string });
		const deletedFiles = await Promise.all(paths.map(async (path: string) => {
			await dbx.filesDeleteV2({ path });
		}));
		console.log("deletedFiles: ", deletedFiles)
		res.status(200).json({ message: 'Files deleted successfully' });
	} catch (error) {
		console.error('Error deleting object from dropbox:', error);
		res.status(500).send('Error deleting object from dropbox');
	}
}