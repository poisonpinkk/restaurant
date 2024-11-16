import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaPageRoutingModule } from './empresa-routing.module';

import { EmpresaPage } from './empresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmpresaPage]
})
export class EmpresaPageModule {}
