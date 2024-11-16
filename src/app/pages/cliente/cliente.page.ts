import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  reservaForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  numeroReserva!: number;

  horas: string[] = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
  }

  async reservar() {
    if (this.reservaForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        spinner: 'crescent'
      });

      await loading.present();

      setTimeout(async () => {
        await loading.dismiss();
        this.numeroReserva = Math.floor(Math.random() * 1000000);
        await this.mostrarAlerta();
      }, 2000);
    }
  }

  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Reserva Exitosa',
      message: `Su reserva se ha realizado con éxito, su número de reserva es: ${this.numeroReserva}`,
      buttons: [
        {
          text: 'OK',
          handler: () => this.navCtrl.navigateBack('/home')
        }
      ]
    });

    await alert.present();
  }
}