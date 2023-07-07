# yaml-api-server
This is a Node.js API server that provides user authentication with JWT and serves data from YAML files.

## Features

- User authentication with JWT
- Dynamic API routes based on YAML files in the `apis` directory
- Data from YAML files is served as JSON

## Setup

1. Install Node.js and npm.
2. Clone this repository.
3. Run `npm install` to install the dependencies.
4. Create a `users.json` file with your user data in the `configs` directory.
5. Create a `secret_key` file with your JWT secret key in the `configs` directory.
6. Put your YAML files in the `apis` directory.

## Usage

1. Run `node app.js` to start the server.
2. Send a POST request to `/login` with your username and password to get a JWT.
3. Send a GET request to an API route with the `Authorization: Bearer <token>` header to get the data from the corresponding YAML file.