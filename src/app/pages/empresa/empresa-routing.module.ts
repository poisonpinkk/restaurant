import { NgModule } from '@angular/core';//importa el decorador ngmodule desde angular, que se usa para definir un modulo.
import { Routes, RouterModule } from '@angular/router';//importa las clases routes y routermodule para gestionar la navegación en la aplicacion

import { EmpresaPage } from './empresa.page';//importa el componente empresapage, que se usara como una página en la aplicacion.

const routes: Routes = [//define un array de rutas (routes), que le dice a angular qué componente cargar en función de la url.
  {
    path: '',//establece la ruta vacía (la ruta por defecto para este modulo).
    component: EmpresaPage//asocia la ruta vacía con el componente empresapage.
  }
];

@NgModule({//usamos el decorador @ngmodule para declarar el módulo.
  imports: [RouterModule.forChild(routes)],//configura el routermodule para este módulo con las rutas definidas.
  exports: [RouterModule],//exporta el routerModule para que otras partes de la aplicación puedan usar las rutas definidas aqui
})
export class EmpresaPageRoutingModule {}//define la clase del módulo de rutas de la página empresapage
