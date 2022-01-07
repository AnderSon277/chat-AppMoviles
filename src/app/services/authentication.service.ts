import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: User = null;

  constructor(public afAuth: AngularFireAuth,) {
    this.afAuth.onAuthStateChanged(user => {
      console.log('User: ', user.providerData[0].uid);
      this.currentUser = user;
    });
  }

  async sendVerificationEmail(): Promise<void> {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  async login({ email, password }) {
    try{
      const credential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return credential;
    }catch (error){
      console.log(error);
    }
  }

  logout() {
    return this.afAuth.signOut();
  }

  async register({ email, password }) {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.sendVerificationEmail();
  }

  userDetails() {
    return this.afAuth.user;
  }

}
