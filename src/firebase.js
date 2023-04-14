 import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const app = initializeApp({
  apiKey: "AIzaSyCSyR-75dzFPSlknW1Pj8VSkxcnWqyJ8pI",
  authDomain: "quiz-1c883.firebaseapp.com",
  projectId: "quiz-1c883",
  storageBucket: "quiz-1c883.appspot.com",
  messagingSenderId: "46773582129",
  appId: "1:46773582129:web:ad3af0bde57309c2f85810",
  databaseURL: "https://quiz-1c883-default-rtdb.firebaseio.com",

  // apiKey: process.env.QUIZ_APP_API_KEY,
  // authDomain: process.env.QUIZ_APP_AUTH_DOMAIN,
  // projectId: process.env.QUIZ_APP_PROJECT_ID,
  // storageBucket: process.env.QUIZ_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.QUIZ_APP_MESSAGING_SENDER_ID,
  // appId: process.env.QUIZ_APP_APP_ID,
});

export default app;
