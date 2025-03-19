import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../firebase/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.limpiarCampos(); //limpiar campos al cargar la página
  }

  ionViewWillEnter() {
    this.limpiarCampos(); //limpiar campos cada vez que se entra en la página
  }

  login() {//método que se llama cuando el usuario intenta iniciar sesión.
    this.authService//llama al servicio de autenticación (authservice).
      .login(this.email, this.password)//llama al método login del servicio de autenticación, pasando el correo y la contraseña del usuario.
      .then(() => {//si la promesa del login se resuelve exitosamente, ejecuta este bloque de código.
        let user = this.authService.getCurrentUser();//si el usuario existe (es decir, el login fue exitoso):
        if (user) {
          //redirigir según el rol del usuario
          if (user.rol === 'cliente') {//si el rol del usuario es cliente:
            this.router.navigate(['/cliente']); //redirige al usuario a la página de cliente.
          } else if (user.rol === 'empresa') {//si el rol del usuario es empresa:
            this.router.navigate(['/empresa']);//redirige al usuario a la página de empresa.
          }
        }
      })
      .catch((error) => {//si ocurre algún error durante el login, se captura y ejecuta este bloque.
        this.errorMessage = this.authService.GenerarError(error);//llama al método generar error del servicio de autenticación para generar un mensaje de error y lo asigna a errormessage
      });
  }

  limpiarCampos() {
    this.email = '';//limpia el campo del email.
    this.password = '';//limpia el campo de la contraseña.
    this.errorMessage = '';//limpia cualquier mensaje de error que esté mostrado.
  }
}
