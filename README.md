# Expense Tracker

This is a full-stack monorepo containing an Expo (React Native) frontend and a Node.js (Express) backend.

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

### Step-by-Step Guide: Pushing to Your Own Branch

**1. Clone the repository (if you haven't already):**
```bash
git clone https://github.com/vonarch/expense-tracker.git
cd expense-tracker
```

**2. Check out your specific branch:**
Replace `[your-branch-name]` with your actual branch (e.g., `von-branch`).
```bash
git checkout [your-branch-name]
```
*(Verify you are on the right branch by typing `git branch`. Your branch should have a `*` next to it.)*

**3. Pull the latest changes:**
It's always a good idea to pull before you start working to ensure your local branch is up to date.
```bash
git pull origin [your-branch-name]
```

**4. Make your code changes:**
(Add features, fix bugs, etc. in your code editor.)

**5. Double-check your changes:**
Use this command to verify which branch you are on and see exactly which files you have modified before staging them.
```bash
git status
```

**6. Stage your changes:**
This tells Git you want to include all your modified files in the next commit.
```bash
git add .
```

**7. Commit your changes:**
Write a short, descriptive message explaining what you did.
```bash
git commit -m "Added the login screen"
```

**8. Push to your branch on GitHub:**
```bash
git push origin [your-branch-name]
```

**Note:** Once you're ready to combine your work with the rest of the team, go to GitHub and open a **Pull Request (PR)** from your branch into `dev-branch`.
