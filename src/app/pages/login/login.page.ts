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
    this.limpiarCampos(); // Limpiar campos al cargar la página
  }

  ionViewWillEnter() {
    this.limpiarCampos(); // Limpiar campos cada vez que se entra en la página
  }

  login() {
    this.authService
      .login(this.email, this.password)
      .then(() => {
        let user = this.authService.getCurrentUser();
        if (user) {
          // Redirigir según el rol del usuario
          if (user.rol === 'cliente') {
            this.router.navigate(['/cliente']);
          } else if (user.rol === 'empresa') {
            this.router.navigate(['/empresa']);
          }
        }
      })
      .catch((error) => {
        this.errorMessage = this.authService.GenerarError(error);
      });
  }

  limpiarCampos() {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }
}