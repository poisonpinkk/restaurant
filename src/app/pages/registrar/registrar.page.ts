import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/firebase/auth.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-register',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  // Creamos una variable de tipo User para almacenar los datos del formulario
  userData: User = {
    name: '',
    email: '',
    rol: '',
    rut: '', // Inicialmente vacío, pero será 'cliente' o 'empresa'
  };

  // Variables para los mensajes
  mensajeExito: string = '';
  mensajeError: string = '';
  passwordError: string = ''; // Nuevo mensaje dinámico para la contraseña

  password: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router // Para la redirección
  ) {}

  ngOnInit(): void {
    console.log('register');
  }

  // Método que se ejecutará al escribir la contraseña
  validatePassword() {
    if (this.password.length < 6) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
    } else {
      this.passwordError = ''; // Elimina el error si la validación pasa
    }
  }

  // Método que se ejecutará al enviar el formulario de registro
  async registerUser() {
    this.mensajeExito = '';
    this.mensajeError = '';

    // Validación de contraseña antes de registrar
    if (this.passwordError) {
      return;
    }

    try {
      // 1. Registrar el usuario en Firebase Authentication usando email y password
      const userCredential = await this.authService.register(
        this.userData.email,
        this.password
      );

      // 2. Obtener el UID del usuario registrado
      const uid = userCredential.user?.uid;

      // 3. Almacenar los datos adicionales en Firestore bajo el UID del usuario
      if (uid) {
        const { name, email, rol, rut } = this.userData;

        // Guardar en Firestore sin la contraseña
        await this.firestoreService.createUser(uid, { name, email, rol, rut });

        // 4. Mostrar mensaje de éxito
        this.mensajeExito = '¡Registro exitoso!';

        // Redirigir al usuario a la página de login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error registrando al usuario:', error);
      // Mostrar mensaje de error
      this.mensajeError =
        'Hubo un error al registrar el usuario. Inténtalo nuevamente.';
    }
  }
}