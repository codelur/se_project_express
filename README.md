# WTWR Server

This project implements the back end for the WTWR (What To Wear?) application. It features a **Node.js** and **Express.js** server, utilizing **MongoDB** to store user and clothing item data. The objective is to develop a secure and efficient server with an API and user authentication.

## Features

- **User Management:**

  - Each user has a name, avatar, email, and password.
  - Users can like items belonging to other users.

- **Clothing Items:**

  - Each clothing item has the following attributes:
    - Name
    - Weather conditions suitable for the item
    - Image URL
    - Owner (linked to a user)
    - Likes (users who liked the item)
    - Date created

- **Error Handling:**

  - Handles the following HTTP error codes on the app:
    - **400**: Bad Request (e.g., validation errors)
    - **401**: Unauthorized (e.g., invalid token)
    - **403**: Forbidden (e.g., insufficient permissions)
    - **404**: Resource Not Found
    - **409**: Conflict (e.g., duplicate resources or MongoDB error code 11000)
    - **500**: Internal Server Error
  - Provides appropriate error messages for client requests.

- **Success Responses:**

  - **200**: Successful requests.
  - **201**: Resource successfully created.

- **Authentication & Authorization:**

  - Middleware is implemented to handle user authorization and authentication using **JWT tokens**.
  - Protects existing routes to ensure only authenticated users can access, update, or delete resources.

- **User Registration and Authentication:**

  - Routes and controllers added for user signup and signin.

- **User Data Modification:**

  - Routes and controllers added for modifying the current user's data (e.g., name, avatar).

## Technologies Used

- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing user and clothing item data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.
- **JWT**: JSON Web Tokens for secure user authentication and authorization.

## Project Structure

The project is organized into routes, controllers, and models:

1. **Routes**:
   - Handles API endpoints for users and clothing items.
   - Includes endpoints for signing up, signing in, and modifying user data.
2. **Controllers**:
   - Contains the business logic for handling requests and responses.
3. **Models**:
   - Defines the structure of the database collections (e.g., users, clothing items).

## How to Run

1. Clone this repository:

   git clone https://github.com/codelur/se_project_express.git

2. Set up environment variables:

Create a .env file and include the following variables:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>

## Future Goals

Extend the API to include additional features.
Extend the server to include more robust user profile customization.
Enhance error handling and logging mechanisms.

## Contributions

Feel free to open issues and submit pull requests. All contributions are welcome!
