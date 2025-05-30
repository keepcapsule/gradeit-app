# 🎴 GradeIt - Pokémon Card Grading Web App

**GradeIt** is a web app that helps you decide whether grading your Pokémon cards is worth it — based on raw cost, grading fee, and PSA 9/10 prices. It stores your results securely in Firebase so you can review, edit, and delete them later.

> ✅ Live App: https://gradeit-70083.web.app

---

## 🚀 Features

- 🔐 Google Sign-In (Firebase Authentication)
- 📊 Enter card name, raw value, grading cost, PSA 9 and 10 prices
- 🧠 Instant decision + explanation (based on custom logic)
- 💾 Cards are saved to Firestore per user
- 🗂️ Dashboard lets you view, edit, or delete cards
- ☁️ Firebase Hosting
- 🖤 Dark mode-friendly

---

## 🧪 How to Run Locally

### 1. Clone the Project

```bash
git clone https://github.com/your-username/gradeit.git
cd gradeit-final-working-lite
2. Install Dependencies
bash
Copy code
npm install
3. Add Your Firebase Config
Create the file src/firebase.js and paste your Firebase config:

js
Copy code
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
📍 You’ll find this info in your Firebase console under Project Settings → General → Your apps.

4. Start the App in Dev Mode
bash
Copy code
npm run dev
Visit: http://localhost:5173

🔐 Firestore Rules (Recommended)
In the Firebase Console → Firestore → Rules tab:

js
Copy code
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
🌐 How to Deploy to Firebase Hosting
1. Install Firebase CLI
bash
Copy code
npm install -g firebase-tools
If permission is denied on Mac:

bash
Copy code
sudo npm install -g firebase-tools
2. Login to Firebase
bash
Copy code
firebase login
3. Initialize Hosting
bash
Copy code
firebase init
Choose:

✅ Hosting

✅ Use an existing project → gradeit-70083

✅ Public directory: dist

✅ Configure as a single-page app? → Yes

❌ Do not overwrite index.html if prompted

4. Build the Project
bash
Copy code
npm run build
5. Deploy
bash
Copy code
firebase deploy
🎉 Your app will be live at: https://gradeit-70083.web.app

✨ Future Ideas
Pull PSA prices live from eBay or TCGPlayer

Show profit trend charts

Image upload for cards

Shareable grading results

👨‍💻 Created By
Jamie Evans
🕸️ https://gradeit-70083.web.app

📝 License
MIT — Free to use, modify, and share.

python
Copy code

---

Let me know if you'd like:

- 📦 A PDF version of the README  
- 📄 A printable cheat sheet for Firebase setup  
- 🔄 A GitHub Actions deploy workflow (CI/CD auto deploy)  
I'll generate that next for you.