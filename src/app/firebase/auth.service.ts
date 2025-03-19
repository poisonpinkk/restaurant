import { Injectable } from '@angular/core'; //importa el decorador Injectable, que hace que el servicio sea inyectable.
import { BehaviorSubject } from 'rxjs';//importa BehaviorSubject desde RxJS, que se utiliza para manejar el estado reactivo.
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from '@angular/fire/auth';//importa métodos de autenticación de Firebase.
import { FirestoreService } from './firestore.service';//importa el servicio FirestoreService para interactuar con la base de datos de Firestore.

@Injectable({
  providedIn: 'root',//marca el servicio como disponible a nivel de toda la aplicación.
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<any>(null);//crea un behaviorsubject que guardará el estado de autenticación del usuario.
  authState$ = this.authStateSubject.asObservable();//Convierte el behaviorsubject en un observable para poder ser suscrito desde otros componentes.

  constructor(private afAuth: Auth, private firestoreService: FirestoreService) {
    //configura el método para escuchar el estado de autenticación.
    onAuthStateChanged(this.afAuth, async (user) => {
      if (user) {//si hay un usuario autenticado:
        try {
          //obtiene los datos adicionales del usuario desde firestore usando su UID es decir id.
          const userData = await this.firestoreService.getUser(user.uid);
          if (userData) { //si se encuentran datos de usuario:
            //combina los datos de autenticación con los datos de firestore y actualiza el estado.
            const fullUserData = {
              uid: user.uid,
              email: user.email,
              ...userData,
            };
            this.authStateSubject.next(fullUserData);//actualiza el estado con los datos completos del usuario.
          } else {
            console.error('Error: No se encontraron datos adicionales para el usuario.');
            this.authStateSubject.next(null);//si no se encuentran datos adicionales, establece el estado como null.
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario desde Firestore:', error);
          this.authStateSubject.next(null);//si ocurre un error al obtener datos, establece el estado como null.
        }
      } else {
        this.authStateSubject.next(null);//si no hay un usuario autenticado, establece el estado como null.
      }
    });
  }

  register(email: string, password: string) {
    //método para registrar un usuario con correo y contraseña.
    return createUserWithEmailAndPassword(this.afAuth, email, password);
  }

  login(email: string, password: string) {
    //método para iniciar sesión con correo y contraseña.
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  logout() {
    //método para cerrar sesión.
    return signOut(this.afAuth).then(() => {
      this.authStateSubject.next(null);//actualiza el estado de autenticación a null cuando se cierra la sesión.
    });
  }

  getCurrentUser() {
    //devuelve el estado actual del usuario desde el behavior subject.  behavior subject es para manejar el estado de autenticación del usuario
    return this.authStateSubject.value;
  }

  GenerarError(tipo: any) {
    //método para generar mensajes de error basados en los códigos de error de firebase.
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
    return error;//devuelve el mensaje de error correspondiente.
  }
}
