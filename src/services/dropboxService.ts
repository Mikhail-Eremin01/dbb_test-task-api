import { Dropbox, files } from "dropbox";
import { Buffer } from 'buffer';

export const countFilesInFolder = async (dbx: Dropbox, folderPath: string): Promise<number> => {
	let totalCount = 0;
	
	try {
	  const response = await dbx.filesListFolder({ path: folderPath, recursive: false, include_media_info: false, include_deleted: false });
	  const entries = response.result.entries;
  
	  totalCount += entries.filter((entry: any) => entry['.tag'] === 'file').length;
  
	  const folders = entries.filter((entry: any) => entry['.tag'] === 'folder');
	  for (const folder of folders) {
		if (folder.path_lower) {
		  totalCount += await countFilesInFolder(dbx, folder.path_lower);
		}
	  }
	} catch (error) {
	  console.error('Error fetching folder contents:', error);
	}
  
	return totalCount;
};

export const filePreview = async (dbx: Dropbox, entry: files.FileMetadataReference) => {
	try {
		const previewResponse: any = await dbx.filesGetThumbnail({
			path: entry.path_lower as string
		});
		const buffer = Buffer.from(previewResponse.result.fileBinary);
		const previewBase64 = buffer.toString("base64");
		return previewBase64;
	} catch (error) {
	  console.error('Error listing files with previews:', error);
	  throw error;
	}
};

export const getFullImage = async (dbx: Dropbox, entry: files.FileMetadataReference) => {
	try {
		const response:any = await dbx.filesDownload({ path: entry.path_lower as string });
		const buffer = Buffer.from(response.result.fileBinary);
		const previewBase64 = buffer.toString("base64");
		return previewBase64;
	} catch (error) {
		console.error('Error fetching image from Dropbox:', error);
		// res.status(500).json({ message: 'Error fetching image' });.
	}
};