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
4. *(Note: Our backend now auto-creates the tables for you! Just start the Node server in Step 2).*

## 2. How to Run the Application (Important: Two Terminals Required!)

In modern full-stack development, you must run both the Frontend and the Backend at the same time in two separate terminal windows.

### Terminal 1: The Backend (Node.js & MySQL)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Copy `.env.example` to a new file named `.env` and fill in your DB credentials if necessary.
4. Start the server:
   ```bash
   npm run dev
   ```
   *(You should see "Server running on port 5000" and "Connected to MySQL")*

### Terminal 2: The Frontend (Expo React Native)
1. Open a **new, second terminal** (keep the first one running!) and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo mobile server (Use `-c` to clear the cache and ensure it loads your IP address correctly):
   ```bash
   npm start -- -c
   ```

## 4. How to Test on Your Phone (Expo Go)

You can easily test the mobile app directly on your physical smartphone using the **Expo Go** app.

**1. Download the Expo Go app**
- **Android:** Download from the Google Play Store
- **iPhone:** Download from the Apple App Store

**2. Connect to the same network**
Ensure your smartphone and your computer are connected to the exact same Wi-Fi network.

**3. Scan the QR Code**
When you run `npm start` in the `frontend` folder (from Step 3 above), a large QR code will appear in your terminal.
- **On Android:** Open the Expo Go app and tap "Scan QR Code".
- **On iPhone:** Open your regular Camera app, point it at the QR code, and tap the link that appears.

The app will load on your phone. Any time you save a code file on your computer, the app on your phone will automatically refresh!

## 5. Git Workflow for the Team

This repository uses `dev-branch` as the main development base. We have individual branches for each team member: `von-branch`, `trina-branch`, and `claude-branch`.

### 🔄 Getting the Latest Updates (CRITICAL)

Whenever you start working for the day, or after someone else has added new features, you **must** pull the latest code from `dev-branch` so you aren't working on old code!

**1. Clone the repo (if it's your first time):**
```bash
git clone https://github.com/vonarch/expense-tracker.git
cd expense-tracker
```

**2. Check out your specific branch:**
Replace `[your-branch-name]` with your actual branch (e.g., `von-branch`).
```bash
git checkout [your-branch-name]
```

**3. Pull the latest updates from dev-branch:**
Run this every single time you sit down to code!
```bash
git pull origin dev-branch
```
*(This merges the newest team code into your personal branch so you are fully up to date!)*

### 🚀 Pushing Your Code

**1. Make your code changes:**
(Add features, fix bugs, etc. in your code editor.)

**2. Double-check your changes:**
Use this command to verify which branch you are on and see exactly which files you have modified before staging them.
```bash
git status
```

**3. Stage your changes:**
This tells Git you want to include all your modified files in the next commit.
```bash
git add .
```

**4. Commit your changes:**
Write a short, descriptive message explaining what you did.
```bash
git commit -m "Added the login screen"
```

**5. Push to your branch on GitHub:**
```bash
git push origin [your-branch-name]
```

**Note:** Once you're ready to combine your work with the rest of the team, go to GitHub and open a **Pull Request (PR)** from your branch into `dev-branch`.
