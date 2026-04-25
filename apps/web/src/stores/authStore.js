import { create } from "zustand";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
  observeAuth,
} from "../firebase/firebaseAuth";

const toAuthUser = (firebaseUser) =>
  firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      }
    : null;

const mapAuthError = (error) => {
  const code = error?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Allow popups for this site and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account with this email already exists using a different sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error?.message ?? "Something went wrong. Please try again.";
  }
};

export const useAuthStore = create((set, get) => ({
  user: null,
  initializing: true,
  submitting: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async ({ email, password, name }) => {
    set({ submitting: true, error: null });
    try {
      const user = await registerWithEmail({ email, password, name });
      set({ user: toAuthUser(user), submitting: false });
      return user;
    } catch (error) {
      set({ submitting: false, error: mapAuthError(error) });
      throw error;
    }
  },

  login: async ({ email, password }) => {
    set({ submitting: true, error: null });
    try {
      const user = await loginWithEmail({ email, password });
      set({ user: toAuthUser(user), submitting: false });
      return user;
    } catch (error) {
      set({ submitting: false, error: mapAuthError(error) });
      throw error;
    }
  },

  loginGoogle: async () => {
    set({ submitting: true, error: null });
    try {
      const user = await loginWithGoogle();
      set({ user: toAuthUser(user), submitting: false });
      return user;
    } catch (error) {
      set({ submitting: false, error: mapAuthError(error) });
      throw error;
    }
  },

  logout: async () => {
    await firebaseLogout();
    set({ user: null });
  },

  subscribe: () =>
    observeAuth((firebaseUser) => {
      set({ user: toAuthUser(firebaseUser), initializing: false });
    }),
}));
