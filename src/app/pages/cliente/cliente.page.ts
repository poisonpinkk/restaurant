import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { AuthService } from 'src/app/firebase/auth.service';
import { Reservation } from 'src/app/models/reservation.models';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  reservaForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];

  horas: string[] = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
    });
  }

  async reservar() {
    if (this.reservaForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser || !currentUser.rol) {
        await this.mostrarAlerta('Error', 'Hubo un problema al obtener los datos del usuario. Por favor, vuelve a iniciar sesión.');
        this.navCtrl.navigateRoot('/login');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Cargando...',
        spinner: 'crescent',
      });

      await loading.present();

      const reservation: Reservation = {
        uid: currentUser.uid,
        rol: 'cliente',
        fecha: this.reservaForm.value.fecha,
        hora: this.reservaForm.value.hora,
        cantidad: this.reservaForm.value.cantidad,
      };

      try {
        await this.firestoreService.createReservation(reservation);
        await loading.dismiss();
        await this.mostrarAlerta('Reserva Exitosa', 'Tu reserva se ha guardado correctamente.');
        await this.authService.logout();
        this.navCtrl.navigateRoot('/login');
      } catch (error) {
        await loading.dismiss();
        console.error('Error al guardar la reserva:', error);
        await this.mostrarAlerta('Error', 'Hubo un error al guardar la reserva.');
      }
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}