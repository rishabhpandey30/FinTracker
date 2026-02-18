# FinTrack — Personal Finance Tracker

A modern, full-featured personal finance tracker built with React, Firebase, and Recharts.


## 🌐 Live Demo

🚀 **Visit the Live Website:**  
👉 [Click Here to View Live Dashboard](https://fin-tracker-dev.vercel.app/)


## ✨ Features

- 🔐 Firebase Email/Password Authentication
- 💳 Dashboard with Balance, Income & Expense summary cards
- 📊 Recharts Pie & Bar charts for analytics
- 🔍 Search & filter transactions by title, category, and date
- ➕ Add, Edit & Delete transactions with modal form
- 🌙 Dark / Light mode toggle (persisted in localStorage)
- 📱 Fully responsive design
- ⚡ Floating action button for quick access

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Firebase Auth | User authentication |
| Firebase Firestore | Cloud database |
| Recharts | Data visualization |
| Pure CSS | Styling (no Tailwind) |

## 📁 Folder Structure

```
src/
├── components/
│   ├── Charts.jsx
│   ├── Filters.jsx
│   ├── FloatingAddButton.jsx
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx
│   ├── SummaryCards.jsx
│   ├── TransactionCard.jsx
│   ├── TransactionList.jsx
│   └── TransactionModal.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── TransactionContext.jsx
├── firebase/
│   ├── auth.js
│   ├── config.js
│   └── firestore.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── styles/
│   ├── auth.css
│   ├── cards.css
│   ├── charts.css
│   ├── dashboard.css
│   ├── filters.css
│   ├── global.css
│   ├── modal.css
│   └── navbar.css
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Firestore Database** (start in test mode, then update rules)
5. Go to Project Settings → Your apps → Add web app
6. Copy the config and paste it into `src/firebase/config.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 3. Set Firestore Security Rules

In the Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📦 Build for Production

```bash
npm run build
```

## 🌐 Deployment

### Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Framework preset: **Vite**
5. Click **Deploy**

Or via CLI:
```bash
npm install -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy site**

> **Important**: For Netlify, add a `_redirects` file in the `public/` folder:
> ```
> /* /index.html 200
> ```
> This ensures React Router works correctly on page refresh.

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔒 Security Notes

- Never commit your Firebase config with real credentials to a public repo
- Use environment variables (`.env`) for production:
  ```
  VITE_FIREBASE_API_KEY=your_key
  VITE_FIREBASE_AUTH_DOMAIN=your_domain
  ...
  ```
  Then reference them in `config.js` as `import.meta.env.VITE_FIREBASE_API_KEY`

