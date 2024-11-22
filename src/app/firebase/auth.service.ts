import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<any>(null);
  authState$ = this.authStateSubject.asObservable();

  constructor(private afAuth: Auth, private firestoreService: FirestoreService) {
    onAuthStateChanged(this.afAuth, async (user) => {
      if (user) {
        try {
          const userData = await this.firestoreService.getUser(user.uid);
          if (userData) {
            const fullUserData = {
              uid: user.uid,
              email: user.email,
              ...userData,
            };
            this.authStateSubject.next(fullUserData);
          } else {
            console.error('Error: No se encontraron datos adicionales para el usuario.');
            this.authStateSubject.next(null);
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario desde Firestore:', error);
          this.authStateSubject.next(null);
        }
      } else {
        this.authStateSubject.next(null);
      }
    });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.afAuth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  logout() {
    return signOut(this.afAuth).then(() => {
      this.authStateSubject.next(null);
    });
  }

  getCurrentUser() {
    return this.authStateSubject.value;
  }

  GenerarError(tipo: any) {
    let error: string = '';
    switch (tipo.code) {
      case 'auth/email-already-in-use':
        error = 'El correo electrónico ya está en uso';
        break;
      case 'auth/invalid-email':
        error = 'El correo electrónico no es válido';
        break;
      case 'auth/user-not-found':
        error = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        error = 'Contraseña incorrecta';
        break;
      case 'auth/network-request-failed':
        error = 'Error de red. Verifique su conexión a internet';
        break;
      case 'auth/invalid-credential':
        error = 'Credenciales inválidas';
        break;
      default:
        error = 'Error: ' + tipo.message;
    }
    return error;
  }
}
