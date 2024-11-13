import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }
    // Método para mostrar la alerta
    async enviarEnlace() {
      const alert = await this.alertController.create({
        header: 'Enlace enviado',
        message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
        buttons: ['OK']
      });
  
      await alert.present();
    }

}
