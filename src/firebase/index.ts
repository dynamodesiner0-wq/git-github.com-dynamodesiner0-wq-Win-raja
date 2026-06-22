'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }

  // Standard initialization for production use
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
