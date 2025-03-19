//importaciones necesarias para el funcionamiento del componente
import { Component, OnInit } from '@angular/core';//importa las funcionalidades de Angular para definir un componente y el ciclo de vida oninit
import { FormBuilder, FormGroup, Validators } from '@angular/forms';//importa herramientas para crear y validar formularios en angular
import { NavController, AlertController, LoadingController } from '@ionic/angular';//Importa controladores de navegación, alertas y carga en ionic
import { FirestoreService } from 'src/app/firebase/firestore.service';//importa un servicio personalizado para manejar firestore
import { AuthService } from 'src/app/firebase/auth.service';//importa un servicio personalizado para manejar autenticación
import { Reservation } from 'src/app/models/reservation.models';//importa el modelo de datos reservation

//decorador que define un componente de angular
@Component({
  selector: 'app-cliente',//define el selector para usar este componente en html
  templateUrl: './cliente.page.html',//enlace al archivo de plantilla html asociado
  styleUrls: ['./cliente.page.scss'],//enlace al archivo de estilos css asociado
})

//clase del componente cliente page, que representa la página del cliente
export class ClientePage implements OnInit {
  reservaForm!: FormGroup;//variable que almacenara el formulario de reserva
  today: string = new Date().toISOString().split('T')[0];//obtiene la fecha actual en formato `YYYY-MM-DD` para evitar selecciones de fechas pasadas

  //lista de horas disponibles para la reserva
  horas: string[] = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  //constructor del componente donde se inyectan las dependencias necesarias
  constructor(
    private fb: FormBuilder, //servicio para construir formularios
    private navCtrl: NavController,//controlador de navegación en ionic
    private alertController: AlertController,//controlador para mostrar alertas en ionic
    private loadingController: LoadingController,//controlador para mostrar pantallas de carga en ionic
    private firestoreService: FirestoreService,//servicio personalizado para interactuar con firestore
    private authService: AuthService//servicio personalizado para manejar la autenticación
  ) {}

  //método del ciclo de vida ngoninit, que se ejecuta cuando el componente se inicializa
  ngOnInit() {
    //inicializa el formulario con los campos requeridos y sus validaciones
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],//campo de fecha obligatorio
      hora: ['', Validators.required],//campo de hora obligatorio
      cantidad: ['', [Validators.required, Validators.min(1)]],//campo de cantidad obligatorio con mínimo 1
    });
  }

  //metodo para realizar una reserva
  async reservar() {
    //verifica si el formulario es válido antes de continuar
    if (this.reservaForm.valid) {
      //obtiene el usuario actualmente autenticado
      const currentUser = this.authService.getCurrentUser();
      //si no hay usuario autenticado o falta el rol, muestra un error y redirige al login
      if (!currentUser || !currentUser.rol) {
        await this.mostrarAlerta('Error', 'Hubo un problema al obtener los datos del usuario. Por favor, vuelve a iniciar sesión.');
        this.navCtrl.navigateRoot('/login');//redirige al usuario a la pantalla de inicio de sesión
        return;//detiene la ejecución del método
      }

      //crea y muestra un indicador de carga mientras se procesa la reserva
      const loading = await this.loadingController.create({
        message: 'Cargando...',//mensaje de carga
        spinner: 'crescent',//tipo de animación del spinner
      });

      await loading.present();//muestra la pantalla de carga

      //construye un objeto de reserva con los datos del formulario y del usuario
      const reservation: Reservation = {
        uid: currentUser.uid,//id del usuario autenticado
        rol: 'cliente',//se asigna el rol 'cliente' a la reserva
        fecha: this.reservaForm.value.fecha,//fecha seleccionada en el formulario
        hora: this.reservaForm.value.hora, //hora seleccionada en el formulario
        cantidad: this.reservaForm.value.cantidad,//cantidad de personas ingresada en el formulario
      };

      try {
        //llama al servicio firestore para guardar la reserva en la base de datos
        await this.firestoreService.createReservation(reservation);
        await loading.dismiss();//cierra la pantalla de carga
        await this.mostrarAlerta('Reserva Exitosa', 'Tu reserva se ha guardado correctamente.');//muestra un mensaje de éxito
        await this.authService.logout();//cierra sesión del usuario después de la reserva
        this.navCtrl.navigateRoot('/login');//redirige al usuario al login después de hacer la reserva
      } catch (error) {
        await loading.dismiss();//cierra la pantalla de carga en caso de error
        console.error('Error al guardar la reserva:', error);//muestra el error en la consola
        await this.mostrarAlerta('Error', 'Hubo un error al guardar la reserva.');//muestra una alerta de error
      }
    }
  }

  //método para mostrar alertas en pantalla
  async mostrarAlerta(header: string, message: string) {
   //crea la alerta con los parámetros recibidos
    const alert = await this.alertController.create({
      header, //título de la alerta
      message, //mensaje de la alerta
      buttons: ['OK'],//botón para cerrar la alerta
    });
    await alert.present();//muestra la alerta en pantalla
  }
}
