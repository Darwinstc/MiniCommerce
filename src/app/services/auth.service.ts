import { Injectable } from '@angular/core';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from '../core/firebase.config';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentAppUser: User | null = null;

  constructor() {
    onAuthStateChanged(
      firebaseAuth,
      async firebaseUser => {
        if (!firebaseUser) {
          this.currentAppUser = null;
          return;
        }

        this.currentAppUser =
          await this.loadUser(firebaseUser);
      }
    );
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<User> {

    const credentials =
      await createUserWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password
      );

    const user: User = {
      id: credentials.user.uid,
      name: name.trim(),
      email:
        credentials.user.email ??
        email.trim().toLowerCase()
    };

    await setDoc(
      doc(
        firestore,
        'users',
        credentials.user.uid
      ),
      user
    );

    this.currentAppUser = user;

    return user;
  }

  async login(
    email: string,
    password: string
  ): Promise<User> {

    const credentials =
      await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password
      );

    const user =
      await this.loadUser(
        credentials.user
      );

    this.currentAppUser = user;

    return user;
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    this.currentAppUser = null;
  }

  isAuthenticated(): boolean {
    return firebaseAuth.currentUser !== null;
  }

  currentUser(): User | null {
    return this.currentAppUser;
  }

  private async loadUser(
    firebaseUser: FirebaseUser
  ): Promise<User> {

    const userDocument =
      await getDoc(
        doc(
          firestore,
          'users',
          firebaseUser.uid
        )
      );

    if (userDocument.exists()) {
      return userDocument.data() as User;
    }

    return {
      id: firebaseUser.uid,
      name:
        firebaseUser.displayName ??
        firebaseUser.email ??
        'Usuario',
      email:
        firebaseUser.email ?? ''
    };
  }
}