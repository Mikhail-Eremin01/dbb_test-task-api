import { Dropbox } from 'dropbox';
import { Request, Response } from 'express';

export const restoreFiles = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers['authorization'];

		if (!authHeader) {
		return res.status(400).json({ message: 'Authorization header missing' });
		}
    	const accessToken = authHeader.replace('Bearer ', '');
		const { paths } = req.body;

		if (!accessToken || !paths || !Array.isArray(paths)) {
			return res.status(400).json({ message: 'Invalid input' });
		}
		const dbx = new Dropbox({ accessToken: accessToken as string });
		
		await Promise.all(paths.map(async (path: string) => {
			const deletedFile = await dbx.filesListRevisions({
				path: path,
			});

			const restoredItem = await dbx.filesRestore({
				path: deletedFile?.result.entries[0].path_lower as string,
				rev: deletedFile?.result.entries[0].rev,
			});
			console.log("restoredItem: ", restoredItem)
		}));

		res.status(200).json({ message: 'Files restored successfully' });
	} catch (error) {
		console.error('Error restoring object in dropbox:', error);
		res.status(500).send('Error restoring object in dropbox');
	}
}