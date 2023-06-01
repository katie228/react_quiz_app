import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import "firebase/database";
import { get, getDatabase, ref, set } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email, password, username, role) {
    const auth = getAuth();
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(user, {
      displayName: username,
    });

    // Записываем роль в Firebase Realtime Database
    const db = getDatabase();
    set(ref(db, "roles/" + user.uid), { role: role });

    setCurrentUser((prevUser) => ({
      ...prevUser,
      role: role,
      displayName: username, // Добавляем displayName в состояние
    }));
  }

  async function login(email, password) {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // сначала обновляем состояние с базовыми данными пользователя
    setCurrentUser(user);

    // Затем извлекаем роль из Firebase Realtime Database
    const db = getDatabase();
    const roleRef = ref(db, "roles/" + user.uid);
    const roleSnapshot = await get(roleRef);
    const role = roleSnapshot.val().role;

    setCurrentUser((prevUser) => ({
      ...prevUser,
      role: role,
      displayName: user.displayName, // Добавляем displayName в состояние
    }));
  }

  //logout func
  function logout() {
    const auth = getAuth();
    return signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
