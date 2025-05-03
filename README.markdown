# ChatApp

ChatApp is a real-time chat application built with Node.js, Express, MongoDB, and Socket.IO. It supports real-time messaging and user authentication via JSON Web Tokens (JWT) and Google OAuth. This README provides instructions to set up and run the application locally.

## Features

- Real-time messaging using Socket.IO.
- User authentication with JWT and Google OAuth.
- MongoDB for persistent storage of user data and messages.
- Simple and intuitive user interface.

## Prerequisites

Before setting up the ChatApp, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (running locally or accessible via a URI)
- [Git](https://git-scm.com/) (for cloning the repository)

## Installation

Follow these steps to set up the ChatApp on your local machine:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Abhishek-Jalkhare/ChatApp.git
   cd ChatApp
   ```

2. **Install Dependencies**:
   Install the required Node.js packages using npm:

   ```bash
   npm install
   ```

3. **Set Up MongoDB**:

   - Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`. If using a different MongoDB instance (e.g., MongoDB Atlas), update the `MONGODB_URI` accordingly.
   - The database name is `ChatApp` (as specified in the URI).

4. **Configure Environment Variables**:
   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   MONGODB_URI=mongodb://127.0.0.1/ChatApp
   JWT_SECRET=1234567890
   i you want to set google auth generate google client id and client secret  and store it in .env file
   ```

   - `MONGODB_URI`: The connection string for your MongoDB database. Replace `127.0.0.1` with your MongoDB host if different.
   - `JWT_SECRET`: A secret key for signing JWTs. Use a secure, unique value in production (avoid using `1234567890`).
   - `GOOGLE_CLIENT_ID`: The client ID for Google OAuth authentication.
   - `GOOGLE_CLIENT_SECRET`: The client secret for Google OAuth authentication.

5. **Run the Application**:
   Start the server using:
   ```bash
   npm start
   ```
   The app should now be running on `http://localhost:3000` (or the port specified in your code).

## Google Authentication

The ChatApp supports user authentication via Google OAuth. To test this feature:

- Use one of the following Google accounts:
  - `abhishekjalkhare2003@gmail.com`
  - `abujalkhare2003@gmail.com`
- Contact the repository owner (Abhishek Jalkhare) for access or further details if needed.
- Ensure the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in the `.env` file.
- After logging in with Google, the app will authenticate the user and provide access to the chat functionality.

## Dependencies

The ChatApp relies on the following Node.js packages (check `package.json` for exact versions):

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling for Node.js.
- `jsonwebtoken`: For generating and verifying JWTs.
- `socket.io`: For real-time, bidirectional communication.
- `dotenv`: For loading environment variables from a `.env` file.
- `passport`: For authentication, including Google OAuth.
- `passport-google-oauth20`: Strategy for Google OAuth authentication.
- Other dependencies (e.g., `cors`, `bcryptjs`) may be included as needed.

To install these manually (if not already in `package.json`):

```bash
npm install express mongoose jsonwebtoken socket.io dotenv passport passport-google-oauth20
```

## Environment Variables

The application requires the following environment variables to be set in a `.env` file:

| Variable               | Description                | Example Value                                                              |
| ---------------------- | -------------------------- | -------------------------------------------------------------------------- |
| `MONGODB_URI`          | MongoDB connection string  | `mongodb://127.0.0.1/ChatApp`                                              |
| `JWT_SECRET`           | Secret key for JWT signing | `1234567890` (use a secure value)                                          |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID     | `855624615929-5h6ma7gj9e3d6tbt6hcttltrr3gsdm7o.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `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`                                      |

**Security Note**: In a production environment:

- Use a strong, unique `JWT_SECRET` and store it securely (e.g., in a secrets manager).
- Do not expose `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` in the repository or public code.
- Ensure these values are kept confidential and not hardcoded.

## Running the App

- After completing the setup, run:
  ```bash
  npm start
  ```
- Open your browser and navigate to `http://localhost:3000` (or the configured port).
- Register, log in with Google, or use JWT-based authentication to start chatting in real-time.

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and the `MONGODB_URI` is correct. Check MongoDB logs for issues.
- **Google OAuth Error**: Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set and that the Google account used is authorized (contact Abhishek Jalkhare for access).
- **Port Conflict**: If `localhost:3000` is in use, update the port in your app’s configuration or free the port.
- **Missing Dependencies**: Run `npm install` again or check `package.json` for missing packages.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
