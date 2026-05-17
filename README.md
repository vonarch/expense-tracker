# Expense Tracker

This is a full-stack monorepo containing an Expo (React Native) frontend and a Node.js (Express) backend.

## Tech Stack
**Frontend:**
- **React Native / Expo:** Core mobile framework
- **Expo Router:** File-based navigation
- **Tailwind CSS (NativeWind):** Styling system
- **TypeScript:** Type safety

**Backend:**
- **Node.js & Express.js:** API server
- **MySQL (via XAMPP):** Relational database
- **JWT (JSON Web Tokens):** Authentication

## Prerequisites
- **Node.js** installed on your machine
- **XAMPP** installed (for MySQL Database)

## 1. Database Setup (XAMPP)
1. Open the XAMPP Control Panel and Start **MySQL** and **Apache**.
2. Click the "Admin" button next to MySQL to open **phpMyAdmin**.
3. Create a new database named `expense_tracker`.
4. *(SQL import instructions will go here once we define the tables)*

## 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Update the `.env` values if your local MySQL has a password)*
4. Start the server:
   ```bash
   npm run dev
   ```

## 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo app:
   ```bash
   npm start
   ```
