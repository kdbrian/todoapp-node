Here’s a detailed `README.md` for your project:
# To-Do List REST API
A simple REST API for managing a to-do list, built with Node.js, Express, and Swagger for API documentation.

## Table of Contents
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Details](#project-details)
- [License](#license)

## Project Structure

The project is organized as follows:

```
├── openapi-3.0.yml        # OpenAPI specification file
├── index.js               # Entry point for the application
├── middleware
│   └── swagger.js         # Swagger middleware configuration
├── routes
│   └── todos.js           # Routes for managing to-do items
├── package.json           # Project dependencies and scripts
├── package-lock.json
├── README.md              # Project documentation
```

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1. Clone the repository:
   ```bash
   git https://github.com/kdbrian/todoapp-node.git
   cd todoapp-node
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running the API

1. Start the server:
   ```bash
   npm start 
   ```

2. The API will be available at:
   ```
   http://localhost:6969/
   ```

3. Access the Swagger documentation at:
   ```
   http://localhost:6969/api-docs
   ```

### Running in Development Mode

To enable logging and hot-reloading, use:
```bash
npm run dev
```

### Example Requests

You can interact with the API using tools like [Postman](https://www.postman.com/) or `curl`.

#### Endpoints

- **GET** `/todos`  
  Retrieve all to-do items.

- **GET** `/todos/{id}`  
  Retrieve a specific to-do item by ID.

- **POST** `/todos`  
  Create a new to-do item. Requires `title` and `description` in the request body.

- **PUT** `/todos/{id}`  
  Update an existing to-do item.

- **DELETE** `/todos/{id}`  
  Delete a to-do item by ID.

## API Documentation

The API is documented using Swagger. The documentation can be accessed at:
```
http://localhost:6969/api-docs
```

## Project Structure and details
The app uses Node js to persist todos in temporary in memory storage. This make it a suitable fit for doing things in dev mode. Whenever we restart the app we get an empty list which we append to, read from and delete from. This can be modified to an underlying datasource but its left out for brevity.

### Dependencies

- `express`: Web framework
- `swagger-jsdoc` & `swagger-ui-express`: For API documentation
- `uuid`: To generate unique IDs for to-do items
- `body-parser`: To parse JSON request bodies

### Dev Dependencies

- `nodemon`: For automatic server reloading in development

### Scripts

- `npm start`: Start the application.
- `npm run dev`: Start the application in development mode with logging and hot-reloading.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
