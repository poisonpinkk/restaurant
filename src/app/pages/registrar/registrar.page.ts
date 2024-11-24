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
  userData: User = {
    name: '',
    email: '',
    rol: '',
    rut: '', // Inicialmente vacío
  };

  mensajeExito: string = '';
  mensajeError: string = '';
  passwordError: string = '';
  rutError: string = ''; // Mensaje dinámico para el RUT

  password: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('register');
  }

  // Validación de la contraseña
  validatePassword() {
    if (this.password.length < 6) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
    } else {
      this.passwordError = '';
    }
  }

  // Validación del RUT
  validateRut() {
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;

    // Verificar formato
    if (!rutRegex.test(this.userData.rut)) {
      this.rutError = 'Formato de RUT inválido. Ejemplo: 12345678-9';
      return;
    }

    // Verificar dígito verificador
    const [rutBody, dv] = this.userData.rut.split('-');
    if (!this.verifyRutDigit(rutBody, dv)) {
      this.rutError = 'Dígito verificador inválido.';
      return;
    }

    // Si es válido, limpiar el mensaje de error
    this.rutError = '';
  }

  // Función para verificar el dígito verificador del RUT
  private verifyRutDigit(rutBody: string, dv: string): boolean {
    let sum = 0;
    let multiplier = 2;

    // Iterar sobre los dígitos del RUT desde el final hacia el inicio
    for (let i = rutBody.length - 1; i >= 0; i--) {
      sum += parseInt(rutBody[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDv = 11 - (sum % 11);
    const formattedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'k' : calculatedDv.toString();

    // Comparar el dígito verificador calculado con el ingresado
    return formattedDv === dv.toLowerCase();
  }

  // Método para registrar al usuario
  async registerUser() {
    this.mensajeExito = '';
    this.mensajeError = '';

    // Validar RUT antes de continuar
    if (this.rutError || !this.userData.rut) {
      this.mensajeError = 'Por favor, verifica el RUT ingresado.';
      return;
    }

    // Validar contraseña
    if (this.passwordError) {
      return;
    }

    try {
      const userCredential = await this.authService.register(
        this.userData.email,
        this.password
      );

      const uid = userCredential.user?.uid;

      if (uid) {
        const { name, email, rol, rut } = this.userData;

        await this.firestoreService.createUser(uid, { name, email, rol, rut });

        this.mensajeExito = '¡Registro exitoso!';
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error registrando al usuario:', error);
      this.mensajeError = 'Hubo un error al registrar el usuario. Inténtalo nuevamente.';
    }
  }
}