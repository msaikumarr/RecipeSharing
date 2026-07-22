# 🍽️ Recipe Sharing Platform

> A **Hackathon Winning Full-Stack MERN Application** that enables users to create, discover, and share delicious recipes with the community.

---

## 📖 Overview

**Recipe Sharing Platform** is a full-stack web application built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. The platform provides a centralized space where users can securely register, log in, publish their own recipes, explore recipes shared by others, and manage their personal recipe collection.

Developed during a hackathon, this project was recognized as a **winning solution** for its user-friendly interface, complete functionality, and practical approach to recipe management.

---

## 🚀 Features

### 👤 User Authentication

* User Registration
* Secure Login
* JWT-based Authentication
* Password Encryption using bcrypt
* Protected Routes

### 🍲 Recipe Management

* Create new recipes
* View all recipes
* View recipe details
* Edit existing recipes
* Delete recipes
* Manage personal recipes

### 🔍 Search & Discovery

* Browse recipes
* Search recipes by title
* Filter recipes by category *(if implemented)*

### 📱 Responsive Design

* Mobile-friendly interface
* Clean and intuitive user experience
* Responsive layout across devices

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Bootstrap / Tailwind CSS *(depending on implementation)*
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt

### Deployment

* Frontend: Vercel
* Backend: Node.js Server

---

## 🏗️ Project Architecture

```text
                User
                  │
                  ▼
          React Frontend
                  │
         HTTP/API Requests
                  │
                  ▼
      Express.js + Node.js
                  │
          Business Logic
                  │
                  ▼
          MongoDB Database
```

---

## 📂 Typical Project Structure

```text
RecipeSharing/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ How It Works

1. A user registers and creates an account.
2. The password is securely hashed using **bcrypt**.
3. The user logs in and receives a **JWT token**.
4. Authenticated users can create, edit, and delete recipes.
5. Recipe information is stored in **MongoDB**.
6. The frontend communicates with the backend through REST APIs.
7. Users can browse and search recipes shared by the community.

---

## 📊 Database Design

### Users

| Field     | Type            |
| --------- | --------------- |
| _id       | ObjectId        |
| name      | String          |
| email     | String          |
| password  | String (Hashed) |
| createdAt | Date            |

### Recipes

| Field        | Type     |
| ------------ | -------- |
| _id          | ObjectId |
| title        | String   |
| ingredients  | Array    |
| instructions | String   |
| category     | String   |
| image        | String   |
| createdBy    | ObjectId |
| createdAt    | Date     |

---

## 🔐 Security Features

* Password Hashing with bcrypt
* JWT Authentication
* Protected API Routes
* Input Validation
* Authorization for recipe ownership

---

## 📡 REST API Overview

| Method | Endpoint     | Description          |
| ------ | ------------ | -------------------- |
| POST   | /register    | Register a new user  |
| POST   | /login       | User login           |
| GET    | /recipes     | Fetch all recipes    |
| GET    | /recipes/:id | Fetch recipe details |
| POST   | /recipes     | Create a recipe      |
| PUT    | /recipes/:id | Update a recipe      |
| DELETE | /recipes/:id | Delete a recipe      |

---

## 💡 Key Highlights

* Full-stack MERN architecture
* Secure authentication using JWT
* Complete CRUD functionality
* Responsive user interface
* RESTful API design
* MongoDB database integration
* Clean and modular code structure

---

## 🏆 Hackathon Achievement

This project was developed during a hackathon and was recognized as a **winning project** for its innovation, technical implementation, user experience, and practical value.

---

## 📚 What We Learned

* Building scalable MERN applications
* REST API development
* Authentication and authorization
* MongoDB data modeling
* Frontend-backend integration
* Team collaboration under tight deadlines
* Debugging and deployment

---

## 🚀 Future Enhancement
* 🤖 AI-powered recipe recommendation
* 📅 Meal planning
* 🛒 Shopping list generation
* 🌙 Dark modes
* 🔔 Notifications

---

## 👨‍💻 Contributors

Developed as a collaborative hackathon project by the project team.

---

## 📜 License

This project is intended for educational and demonstration purposes.
