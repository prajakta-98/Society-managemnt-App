# Society Management

MERN monorepo with a React/Vite client and an Express/Mongoose server.

## Setup

1. Install dependencies from the repository root:

   ```sh
   npm install
   ```

2. Copy `server/.env.example` to `server/.env` and provide your MongoDB URI.

3. Start the server and client in separate terminals:

   ```sh
   npm run dev:server
   npm run dev:client
   ```

The client runs at `http://localhost:5173` and proxies `/api` requests to the server at `http://localhost:5000`.

