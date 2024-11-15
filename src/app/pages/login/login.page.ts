import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../firebase/auth.service';
import { FirestoreService } from '../../firebase/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        const user = this.authService.getCurrentUser();
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
}
