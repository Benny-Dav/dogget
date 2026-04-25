import { auth } from "./firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = async ({ email, password, name }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(user, { displayName: name });
  return user;
};

export const loginWithEmail = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const loginWithGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProvider);
  return user;
};

export const logout = () => signOut(auth);

export const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

export const observeAuth = (callback) => onAuthStateChanged(auth, callback);
