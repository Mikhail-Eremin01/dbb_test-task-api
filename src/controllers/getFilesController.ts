import { Dropbox } from "dropbox";
import { countFilesInFolder, getFullImage } from "../services/dropboxService";
import { Request, Response } from 'express';

export const getMainFiles = async (req: Request, res: Response) => {
	try {
		const { accessToken, subfolder } = req.query;
		console.log("subfolder: ", subfolder)
		const dbx = new Dropbox({ accessToken: accessToken as string });
		const response = await dbx.filesListFolder({ path: typeof(subfolder) === "string" ? `/${subfolder}` : "" });
		const entries = response.result.entries;
		console.log("entries: ", entries)

		const foldersWithFileCount = await Promise.all(entries.map(async (entry) => {
		if (entry['.tag'] === 'folder' && entry.path_lower) {
			const fileCount = await countFilesInFolder(dbx, entry.path_lower);
			return { ...entry, filesCount: fileCount };
		} else if(
			entry['.tag'] === 'file' && entry.path_lower &&
			['.jpg', '.jpeg', '.png', '.pdf', '.gif'].includes(entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase())
		) {
			console.log("entry: ", entry)
			const fullImagebase64 = await getFullImage(dbx, entry)
			return { ...entry, fullImagebase64  };
		}
			return entry;
		}));
		res.status(200).json(foldersWithFileCount);
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching files from Dropbox:', error.message);
			res.status(500).json({ message: `Error fetching files from Dropbox: ${error.message}` });
		} else {
			console.error('Unexpected error:', error);
			res.status(500).json({ message: 'Unexpected error occurred' });
		}
	}
}

export const getDeletedFiles = async (req: Request, res: Response) => {
	try {
		const { accessToken, subfolder } = req.query;
		const dbx = new Dropbox({ accessToken: accessToken as string });
		const response = await dbx.filesListFolder({ path: subfolder ? `/${subfolder}` : "", include_deleted: true });
		const entries = response.result.entries;
		let deletedFoldersFiles = entries?.filter(elem => elem['.tag'] === "deleted")

		const updatedFoldersFiles = await Promise.all(deletedFoldersFiles.map(async (elem) => {

			const extension = elem.path_lower!.substring(elem.path_lower!.lastIndexOf('.')).toLowerCase();

			if (['.jpg', '.jpeg', '.png', '.pdf', '.gif'].includes(extension)) {
				const item = await dbx.filesListRevisions({
					path: elem?.path_lower as string,
					limit: 10,
				});
				return { ...elem, type: 'file', size: item.result.entries[0].size };
			} else {
				return { ...elem, type: 'folder' };
			}
		}))

		res.status(200).json(updatedFoldersFiles);
	} catch (error) {
	  if (error instanceof Error) {
		console.error('Error fetching files from Dropbox:', error.message);
		res.status(500).json({ message: `Error fetching files from Dropbox: ${error.message}` });
	  } else {
		console.error('Unexpected error:', error);
		res.status(500).json({ message: 'Unexpected error occurred' });
	  }
	}
}