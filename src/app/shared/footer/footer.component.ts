import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor(private location: Location, private router: Router, private auth: Auth ) { }

  ngOnInit() {}

  // goBack() {
  //   this.location.back();
  // }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/home']);
    } catch (error){
      console.error('Error al cerrar sesión: ', error);
    }
  }

}
