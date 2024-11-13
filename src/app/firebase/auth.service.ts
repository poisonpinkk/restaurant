import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User } from '@angular/fire/auth';  // Importar la función específica
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStateSubject = new BehaviorSubject<any>(null);
  authState$ = this.authStateSubject.asObservable();

  constructor(private afAuth: Auth, private firestoreService: FirestoreService) {

    onAuthStateChanged(this.afAuth, async (user) => {
      if (user) {
        // Si el usuario está autenticado, obtener datos adicionales desde Firestore
        const userData = await this.firestoreService.getUser(user.uid);
        const fullUserData = {
          uid: user.uid,
          email: user.email,
          ...userData,  // Combinar los datos de autenticación con los datos adicionales
        };
        this.authStateSubject.next(fullUserData);  // Emitir todos los datos
      } else {
        // Si no hay usuario autenticado, emitir null
        this.authStateSubject.next(null);
      }
    });
  }

  // Método para registrar un nuevo usuario con email y password
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.afAuth, email, password);
  }

  // Método para iniciar sesión con email y password
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  // Método para cerrar sesión
  logout() {
    return signOut(this.afAuth).then(() => {
      this.authStateSubject.next(null);  // Emitir null cuando el usuario cierre sesión
    });
  }

  // Método para obtener el estado de autenticación actual (no observable, sino el valor actual)
  getCurrentUser() {
    return this.authStateSubject.value;
  }


  GenerarError(tipo: any){
    let error: string = '';
    // Verificar el código del error para personalizar el mensaje
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
