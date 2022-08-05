import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const createUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const updateUserEmail = (email: string) => {
  return updateEmail(auth.currentUser!, email);
};
export const updateUserPassword = (password: string) => {
  return updatePassword(auth.currentUser!, password);
};
