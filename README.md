Procurement Management System
Description
The Procurement Management System is a web application designed to streamline the procurement process for businesses. It allows users to manage suppliers, purchase orders, inventory, and other procurement activities efficiently. The system is built using the MERN stack (MongoDB, Express, React, Node.js).

Key Features
--------------------------------------------
Supplier Management: Add, update, and manage supplier details.
Purchase Orders: Create, update, and track purchase orders.
Inventory Management: Monitor stock levels and manage products.
User Authentication: Secure login and access control for users.
Responsive UI: Built using React to ensure a user-friendly interface across devices.
Real-time Data: Use of WebSocket (or similar) for real-time updates on inventory and orders.


Technologies Used
-------------------------------------
MongoDB: NoSQL database for storing procurement data.
Express.js: Backend framework for handling API requests.
React.js: Frontend framework for building the user interface.
Node.js: Backend JavaScript runtime for executing server-side code.
JWT (JSON Web Tokens): For secure user authentication.


Installation & Setup
--------------------------------------------------
Prerequisites
Make sure you have the following installed on your machine:

Node.js and npm
MongoDB (locally or use a cloud service like MongoDB Atlas)
Backend Setup
Clone the repository:

bash
git clone <repository_url>
cd backend
Install the backend dependencies:

bash
npm install
Set up MongoDB:

Make sure MongoDB is running locally or configure MongoDB Atlas for cloud storage.
Create a .env file in the backend folder and add your MongoDB connection string:
env
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret_key>
Start the backend server:

bash
npm start
Frontend Setup
Navigate to the frontend directory:

bash
cd frontend
Install the frontend dependencies:

bash
npm install
Start the React development server:

bash
npm start
Open the application in your browser:

Go to http://localhost:3000 (or the port configured for React).

