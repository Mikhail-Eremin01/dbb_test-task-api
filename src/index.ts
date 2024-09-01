import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import checkTokenExpiration from './middlewares/checkToken';
import { getDeletedFiles, getMainFiles } from './controllers/getFilesController';
import { authCallback, authRedirect } from './controllers/authController';
import { deleteFiles } from './controllers/deleteFilesController';
import { restoreFiles } from './controllers/editFilesController';
import { createFolder, uploadFiles } from './controllers/uploadFilesController';

dotenv.config();
const app = express();
const port = 4000;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
connectDB();

// Start OAuth 2.0 flow
app.get('/auth', authRedirect);
app.get('/auth/callback', authCallback);

app.get('/get-dropbox-files', checkTokenExpiration, getMainFiles);
app.get('/get-deleted-files', checkTokenExpiration, getDeletedFiles);

app.delete('/delete-files', checkTokenExpiration, deleteFiles);
app.post('/restore-files', checkTokenExpiration, restoreFiles);
app.post('/upload-files', checkTokenExpiration, uploadFiles);
app.post('/create-folder', checkTokenExpiration, createFolder);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});