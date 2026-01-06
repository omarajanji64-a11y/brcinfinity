
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
};

// This variable will hold the cached Firebase services.
let firebaseServices: FirebaseServices | null = null;

// This is the new, robust initialization function.
// It ensures Firebase is initialized only once, whether on server or client.
export function initializeFirebase(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }

  if (getApps().length > 0) {
    const app = getApp();
    firebaseServices = getSdks(app);
    return firebaseServices;
  }
  
  // This will now be the primary way to initialize, ensuring consistency.
  const app = initializeApp(firebaseConfig);
  firebaseServices = getSdks(app);
  return firebaseServices;
}

export function getSdks(firebaseApp: FirebaseApp): FirebaseServices {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

// Re-exporting non-React utilities
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
