import { NgModule } from '@angular/core';//importa el decorador ngmodule desde angular, que se utiliza para declarar un modulo.
import { CommonModule } from '@angular/common';//importa el CommonModule, que contiene directivas comunes como ngif y ngfor para usarlas en los componentes.
import { FormsModule, ReactiveFormsModule } from '@angular/forms';//importa formsmodule y reactiveformsmodule para trabajar con formularios en angular.
import { IonicModule } from '@ionic/angular';//importa ionicmodule para usar componentes y funcionalidades de ionic, como botones, modales, etc.
import { EmpresaPageRoutingModule } from './empresa-routing.module';//importa el módulo de rutas de la página empresapage para manejar la navegación.
import { EmpresaPage } from './empresa.page';//importa el componente empresapage, que representa la página de la empresa.
import { SharedModule } from 'src/app/shared/shared.module';//importa un modulo compartido, que puede contener componentes, directivas y pipes reutilizables en la aplicacion.

@NgModule({//define un modulo angular usando el decorador ngmodule.
  imports: [//especifica los modulos que se deben importar para este modulo.
    CommonModule,//permite usar funcionalidades comunes como ngif, ngfor, etc.
    FormsModule,//habilita el uso de formularios basados en plantillas.
    IonicModule,//permite el uso de componentes y funcionalidades de ionic.
    EmpresaPageRoutingModule,//incluye el modulo de rutas para este modulo.
    ReactiveFormsModule,//permite trabajar con formularios reactivos en angular.
    SharedModule//incluye modulos o componentes compartidos que pueden ser utilizados en varias partes de la aplicacion.
  ],
  declarations: [EmpresaPage]//declara el componente empresapage que pertenece a este modulo.
})
export class EmpresaPageModule {}//define y exporta el modulo empresapagemodule, que agrupa todos los componentes, rutas y servicios para la pagina de la empresa.
