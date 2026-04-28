# 🏕️ TheOutdoors - Online Shopping E-Commerce Platform

Welcome to **TheOutdoors**! This is a full-stack e-commerce web application designed to provide a seamless and engaging online shopping experience. It features a modern, responsive user interface built with React and Tailwind CSS, powered by a robust Express.js backend and Supabase for data management.

## ✨ Features

- **Modern User Interface**: A beautifully designed, responsive storefront using React and Tailwind CSS.
- **Product Catalog**: Browse and filter through a wide variety of outdoor products and gear.
- **User Authentication**: Secure sign-up and login functionality with encrypted passwords and JWT-based authentication.
- **Shopping Cart**: Easily add, remove, and manage items in your cart.
- **Checkout Process**: Streamlined checkout and order management system.
- **RESTful API**: A powerful backend API built with Express.js to handle data securely.

## 🛠️ Tech Stack

### Frontend
- **React 19** (via Vite)
- **Tailwind CSS** for rapid and responsive styling
- **React Router** for seamless navigation
- **Lucide React** for beautiful icons

### Backend
- **Node.js & Express.js** for the REST API
- **Supabase** (PostgreSQL) for the database
- **JWT (JSON Web Tokens)** for secure authentication
- **Bcrypt.js** for password hashing

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/lakshyapanwar05/Onlineshopping.git
cd Onlineshopping
```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your environment variables (such as Supabase credentials, JWT secrets, etc.).
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will typically run on `http://localhost:5000` or the port specified in your environment variables.*

### 3. Frontend Setup

1. Open a new terminal window/tab and navigate to the root directory of the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`.*

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve the project.

## 📄 License

This project is licensed under the ISC License.
