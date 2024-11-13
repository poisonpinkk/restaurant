import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"restaurant-3b6cc","appId":"1:608931570848:web:7c336219e4ea93e6d455c5","storageBucket":"restaurant-3b6cc.firebasestorage.app","apiKey":"AIzaSyAl9G3jp_w5cSp98hk3zIRp4DiBkl6QaY0","authDomain":"restaurant-3b6cc.firebaseapp.com","messagingSenderId":"608931570848","measurementId":"G-CX5ZDSMPHL"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
