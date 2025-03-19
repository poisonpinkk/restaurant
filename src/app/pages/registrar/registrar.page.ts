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
    rut: '', //inicialmente vacío
  };

  mensajeExito: string = '';
  mensajeError: string = '';
  passwordError: string = '';
  rutError: string = ''; //mensaje dinámico para el RUT

  password: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('register');
  }

  //validación de la contraseña
  validatePassword() {
    if (this.password.length < 6) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
    } else {
      this.passwordError = '';
    }
  }

  //validación del RUT
  validateRut() {
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;

    //verificar formato
    if (!rutRegex.test(this.userData.rut)) {
      this.rutError = 'Formato de RUT inválido. Ejemplo: 12345678-9';
      return;
    }

    //verificar dígito verificador
    const [rutBody, dv] = this.userData.rut.split('-');
    if (!this.verifyRutDigit(rutBody, dv)) {
      this.rutError = 'Dígito verificador inválido.';
      return;
    }

    //si es válido, limpiar el mensaje de error
    this.rutError = '';
  }

  //función para verificar el dígito verificador del RUT
  private verifyRutDigit(rutBody: string, dv: string): boolean {
    let sum = 0;
    let multiplier = 2;

    //iterar sobre los dígitos del RUT desde el final hacia el inicio
    for (let i = rutBody.length - 1; i >= 0; i--) {
      sum += parseInt(rutBody[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDv = 11 - (sum % 11);
    const formattedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'k' : calculatedDv.toString();

    //comparar el dígito verificador calculado con el ingresado
    return formattedDv === dv.toLowerCase();
  }

  //método para registrar al usuario
  async registerUser() {
    this.mensajeExito = '';
    this.mensajeError = '';

    //validar RUT antes de continuar
    if (this.rutError || !this.userData.rut) {
      this.mensajeError = 'Por favor, verifica el RUT ingresado.';
      return;
    }

    //validar contraseña
    if (this.passwordError) {//verifica si existe un error de contraseña (por ejemplo, si la contraseña no cumple con los requisitos de validación).
      return;//si hay un error de contraseña, interrumpe la ejecución del registro y no realiza ninguna acción adicional.
    }

    try {
      const userCredential = await this.authService.register(//llama al servicio de autenticación para registrar al usuario, pasando su correo y contraseña.
        this.userData.email,
        this.password
      );

      const uid = userCredential.user?.uid;//obtiene el UID (identificador único) del usuario registrado a partir de la respuesta del servicio de autenticacion

      if (uid) {
        const { name, email, rol, rut } = this.userData;

        await this.firestoreService.createUser(uid, { name, email, rol, rut });//llama al servicio de Firestore para crear un nuevo documento de usuario en la base de datos con los datos proporcionados.

        this.mensajeExito = '¡Registro exitoso!';
        this.router.navigate(['/login']);//navega a la página de inicio de sesión después de un registro exitoso
      }
    } catch (error) {
      console.error('Error registrando al usuario:', error); //si ocurre algún error en el bloque try, se captura y se maneja aquí:
      this.mensajeError = 'Hubo un error al registrar el usuario. Inténtalo nuevamente.';
    }
  }
}
