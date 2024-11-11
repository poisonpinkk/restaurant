import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usuario: string = '';  // Definimos la propiedad usuario
  private subscriptionAuthService: Subscription | undefined;

  constructor(){

  }

  ngOnInit() {

  }

}
