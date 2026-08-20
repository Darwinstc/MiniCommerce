import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCU85QafEh0Vm_tQKst1YICSlhCw5V5Yys',
  authDomain: 'minicommerce-78315.firebaseapp.com',
  projectId: 'minicommerce-78315',
  storageBucket: 'minicommerce-78315.firebasestorage.app',
  messagingSenderId: '486864119187',
  appId: '1:486864119187:web:fa1d0dd20b34f9a0067466',
  measurementId: 'G-8VE6HR2E40'
};

export const firebaseApp =
  initializeApp(firebaseConfig);

export const firebaseAuth =
  getAuth(firebaseApp);

export const firestore =
  getFirestore(firebaseApp);