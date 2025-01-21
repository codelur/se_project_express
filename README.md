# WTWR Server

This project is the back-end implementation for the WTWR (What To Wear?) application. The server is built using **Node.js** and **Express.js**, with a **MongoDB** database to store information about users and clothing items. The goal is to create a robust server with an API and user authorization.

## Features

- **User Management:**

  - Each user has a name and an avatar.
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
    - **404**: Resource Not Found
    - **500**: Internal Server Error
  - Provides appropriate error messages for client requests.

- **Success Responses:**
  - **200**: Successful requests.
  - **201**: Resource successfully created.

## Technologies Used

- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing user and clothing item data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.

## Project Structure

The project is organized into routes, controllers, and models:

1. **Routes**:
   - Handles API endpoints for users and clothing items.
2. **Controllers**:
   - Contains the business logic for handling requests and responses.
3. **Models**:
   - Defines the structure of the database collections (e.g., users, clothing items).

## How to Run

1. Clone this repository:

   git clone https://github.com/codelur/se_project_express.git

## Future Goals

Implement user authentication and authorization.
Extend the API to include additional features.

## Contributions

Feel free to open issues and submit pull requests. All contributions are welcome!
