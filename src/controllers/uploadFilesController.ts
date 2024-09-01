import { Dropbox } from 'dropbox';
import { Request, Response } from 'express';

export const uploadFiles = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers['authorization'];

		if (!authHeader) {
		return res.status(400).json({ message: 'Authorization header missing' });
		}
    	const accessToken = authHeader.replace('Bearer ', '');
		const { paths, base64Files, name } = req.body;
		const updatedbase64File = base64Files[0].replace(/^data:(image\/[a-zA-Z]+;base64,|application\/pdf;base64,)/, "")

		const fileBuffer = Buffer.from(updatedbase64File, 'base64');

		if (!accessToken || !paths || !Array.isArray(paths) || !base64Files) {
			return res.status(400).json({ message: 'Invalid input' });
		}
		const dbx = new Dropbox({ accessToken: accessToken as string });

		await Promise.all(paths.map(async (path: string) => {
            await dbx.filesUpload({
                path: `${path ? "/" : ""}${path}/${name}`,
                contents: fileBuffer,
            });
        }));

        res.status(200).json({ message: 'Files uploaded successfully' });
	} catch (error) {
		console.error('Error uploading file:', error);
		if (error instanceof Error) {
			console.error('Error fetching files from Dropbox:', error.message);
			res.status(500).json({ message: `Error fetching files from Dropbox: ${error.message}` });
		} else {
			console.error('Unexpected error:', error);
			res.status(500).json({ message: 'Unexpected error occurred' });
		}
	}
}

export const createFolder = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers['authorization'];

		if (!authHeader) {
			return res.status(400).json({ message: 'Authorization header missing' });
		}
		
		const accessToken = authHeader.replace('Bearer ', '');
		const { path } = req.body;
		console.log("path: ", path)
		if (!accessToken || !path) {
			return res.status(400).json({ message: 'Invalid input' });
		}

		const dbx = new Dropbox({ accessToken: accessToken as string });
			console.log("path: ", path)

			try {
				// Создание папки
				await dbx.filesCreateFolderV2({ path: `${path.includes('/') ? `/${path}` : path}` });
			} catch (error: any) {
				if (error.error?.is_conflict) {
					// Если папка уже существует, это нормально
					console.log(`Folder already exists: ${path}`);
				} else {
					throw error; // Проброс других ошибок
				}
			}

		res.status(200).json({ message: 'Folders created successfully' });
	} catch (error) {
		console.error('Error creating folder:', error);
		if (error instanceof Error) {
			console.error('Error creating folder in Dropbox:', error.message);
			res.status(500).json({ message: `Error creating folder in Dropbox: ${error.message}` });
		} else {
			console.error('Unexpected error:', error);
			res.status(500).json({ message: 'Unexpected error occurred' });
		}
	}
};