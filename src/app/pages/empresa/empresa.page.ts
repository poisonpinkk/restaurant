import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { AuthService } from 'src/app/firebase/auth.service';
import { Reservation } from 'src/app/models/reservation.models';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.page.html',
  styleUrls: ['./empresa.page.scss'],
})
export class EmpresaPage implements OnInit {
  empresaForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];

  horas: string[] = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.empresaForm = this.fb.group({
      dia: ['', Validators.required],
      horaDesde: ['', Validators.required],
      horaHasta: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      tipoComida: ['', Validators.required]
    });
  }

  async reservar() {
    if (this.empresaForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        await this.mostrarAlerta('Error', 'Debes iniciar sesión para reservar.');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Cargando...',
        spinner: 'crescent'
      });

      await loading.present();

      // Crear objeto de reserva
      const reservation: Reservation = {
        uid: currentUser.uid,
        rol: 'empresa',
        fecha: this.empresaForm.value.dia,
        horaDesde: this.empresaForm.value.horaDesde,
        horaHasta: this.empresaForm.value.horaHasta,
        cantidad: this.empresaForm.value.cantidad,
        detalles: this.empresaForm.value.tipoComida
      };

      try {
        // Guardar reserva en Firestore
        await this.firestoreService.createReservation(reservation);
        await loading.dismiss();
        await this.mostrarAlerta('Reserva Exitosa', 'Tu reserva se ha guardado correctamente.');
        this.navCtrl.navigateBack('/home');
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
      buttons: ['OK']
    });

    await alert.present();
  }
}