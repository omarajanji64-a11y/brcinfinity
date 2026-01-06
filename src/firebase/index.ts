'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
};

let firebaseServices: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices {
  if (firebaseServices) return firebaseServices;

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  firebaseServices = {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
    storage: getStorage(app),
  };

  return firebaseServices;
}

export const { app, auth, firestore, storage } = initializeFirebase();
