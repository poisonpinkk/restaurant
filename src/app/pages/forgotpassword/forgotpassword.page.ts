import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  email: string = ''; // Variable para almacenar el correo electrónico
  emailError: string = ''; // Mensaje de error para el email

  constructor(private alertController: AlertController, private router: Router) {}

  ngOnInit() {}

  // Método para validar el formato del email
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = 'Por favor, ingresa un correo válido.';
    } else {
      this.emailError = ''; // Elimina el mensaje de error si el email es válido
    }
  }

  // Método para mostrar la alerta
  async enviarEnlace() {
    if (this.emailError) {
      return; // Evita el envío si hay errores
    }

    const alert = await this.alertController.create({
      header: 'Enlace enviado',
      message:
        'Se ha enviado un enlace de recuperación a tu correo electrónico.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.email = ''; // Limpia el campo de correo
              this.router.navigate(['/login']); // Redirige al login
            },
          },
        ],
      });

    await alert.present();
  }
}