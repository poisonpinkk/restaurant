//importaciones necesarias para el funcionamiento del componente
import { Component, OnInit } from '@angular/core';//importa los decoradores para definir un componente y la interfaz OnInit
import { FormBuilder, FormGroup, Validators } from '@angular/forms';//importa herramientas para crear formularios reactivos en Angular
import { NavController, AlertController, LoadingController } from '@ionic/angular';//importa controladores de navegación, alertas y carga en Ionic
import { FirestoreService } from 'src/app/firebase/firestore.service';//importa un servicio para interactuar con firebase firestore
import { AuthService } from 'src/app/firebase/auth.service';//importa un servicio para autenticación de usuarios
import { Reservation } from 'src/app/models/reservation.models';//importa el modelo de datos para reservas

//decorador que define el componente
@Component({
  selector: 'app-empresa',//nombre del selector que se usará en el html
  templateUrl: './empresa.page.html',//ruta del archivo html asociado a este componente
  styleUrls: ['./empresa.page.scss'],//ruta de los estilos css del componente
})
export class EmpresaPage implements OnInit {//definición de la clase del componente, implementa oninit

  empresaForm!: FormGroup;//variable que almacenará el formulario reactivo
  today: string = new Date().toISOString().split('T')[0];//guarda la fecha actual en formato ISO (AAAA-MM-DD)

  //lista de horarios disponibles para la reserva
  horas: string[] = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  //constructor del componente donde se inyectan los servicios necesarios
  constructor(
    private fb: FormBuilder,//servicio para crear formularios reactivos
    private navCtrl: NavController,//controlador de navegación de ionic
    private alertController: AlertController,//controlador para mostrar alertas en la interfaz
    private loadingController: LoadingController,//controlador para mostrar indicadores de carga
    private firestoreService: FirestoreService,//servicio para interactuar con la base de datos firestore
    private authService: AuthService//servicio para autenticación de usuarios
  ) {}

  //método que se ejecuta cuando el componente es inicializado
  ngOnInit() {
    //se inicializa el formulario con sus campos y validaciones
    this.empresaForm = this.fb.group({
      dia: ['', Validators.required],//campo obligatorio para el día de la reserva
      horaDesde: ['', Validators.required],//campo obligatorio para la hora de inicio de la reserva
      horaHasta: ['', Validators.required],//campo obligatorio para la hora de finalización de la reserva
      cantidad: ['', [Validators.required, Validators.min(1)]],//campo obligatorio con un mínimo de 1 persona
      tipoComida: ['', Validators.required]//campo obligatorio para el tipo de comida
    });
  }

  //metodo asincrónico para hacer una reserva - async es una función que permite ejecutar tareas que toman tiempo (como llamadas a bases de datos o APIs)
  async reservar() {
    if (this.empresaForm.valid) {//verifica si el formulario es válido
      const currentUser = this.authService.getCurrentUser();//obtiene el usuario autenticado
      if (!currentUser || !currentUser.rol) {//si no hay usuario o no tiene rol, muestra error y redirige al login
        await this.mostrarAlerta('Error', 'Hubo un problema al obtener los datos del usuario. Por favor, vuelve a iniciar sesión.');
        this.navCtrl.navigateRoot('/login');//redirige al usuario a la página de login
        return;//sale del método para evitar que continúe
      }

      //muestra un indicador de carga mientras se procesa la reserva
      const loading = await this.loadingController.create({
        message: 'Cargando...',//mensaje del indicador de carga
        spinner: 'crescent',//tipo de spinner que se mostrará
      });

      await loading.present();//muestra el indicador de carga

      //se crea un objeto con los datos de la reserva
      const reservation: Reservation = {
        uid: currentUser.uid,//id del usuario que hace la reserva
        rol: 'empresa',//rol del usuario (empresa en este caso)
        fecha: this.empresaForm.value.dia, // fecha de la reserva
        horaDesde: this.empresaForm.value.horaDesde,//hora de inicio de la reserva
        horaHasta: this.empresaForm.value.horaHasta, //hora de finalización de la reserva
        cantidad: this.empresaForm.value.cantidad,//cantidad de personas para la reserva
        detalles: this.empresaForm.value.tipoComida,//tipo de comida seleccionada
      };

      try {
        await this.firestoreService.createReservation(reservation);//guarda la reserva en firestore
        await loading.dismiss();//oculta el indicador de carga
        await this.mostrarAlerta('Reserva Exitosa', 'Tu reserva se ha guardado correctamente.');//muestra un mensaje de éxito
        await this.authService.logout();//cierra la sesión del usuario
        this.navCtrl.navigateRoot('/login');//redirige al usuario al login
      } catch (error) {
        await loading.dismiss();//oculta el indicador de carga en caso de error
        console.error('Error al guardar la reserva:', error);//muestra el error en la consola
        await this.mostrarAlerta('Error', 'Hubo un error al guardar la reserva.');//muestra una alerta de error
      }
    }
  }

  //metodo para mostrar una alerta en pantalla
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,//titulo de la alerta
      message,//mensaje de la alerta
      buttons: ['OK'] //boton de cierre
    });

    await alert.present();//muestra la alerta en pantalla
  }
}
