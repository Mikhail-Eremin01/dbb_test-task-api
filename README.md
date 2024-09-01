# Server-Side Application

## Controller Descriptions

1. **authController**
   - **authCallback**: Handles the authorization logic. When a user successfully authorizes with Dropbox, this function retrieves the `access_token` and sends it to the client application.
   - **authRedirect**: Redirects the user to the Dropbox authorization page using OAuth2.

2. **deleteFilesController**
   - Controller for file deletion. Functionality includes moving files to the deleted files bin.

3. **editFilesController**
   - Contains methods for file modification. Currently, only the **restoreFiles** function is implemented, which restores files from the deleted items.

4. **getFilesController**
   - Controller for retrieving files.
   - **getMainFiles**: Retrieves all files.
   - **getDeletedFiles**: Retrieves files tagged as `deleted`.

5. **uploadFilesController**
   - Controller for uploading new files.

## Additional Functionality

- **User Data Storage**: A mechanism for saving user data has been implemented, but is not currently in use. Future plans include integrating with MongoDB for data storage.

- **Token Validation**: Middleware **checkToken** is used to check the validity of the token. If the token is invalid, the middleware sends an appropriate error to the client application.

## Installation and Setup

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mikhail-Eremin01/dbb_test-task-api.git
   
2. Navigate to the project directory:
    ```bash
    cd dbb_test-task-api
    
3. Install all necessary dependencies:
    ```bash
    npm install
    
### Running the Application

1. Start the server:
    
    ```bash
    npm start
    
The server will be running on port 4000.

2. After starting the server, you can proceed to the client side of the application by following the instructions in the  [client application README](https://github.com/Mikhail-Eremin01/dbb_test-task-ui/blob/main/README.md).