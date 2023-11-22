import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(){}

separate() {
// console.log(this.sqlCommand.value)
let sqlCommand = document.getElementById('sqlText') as HTMLInputElement;
let sqlDetail = document.getElementById('detailText') as HTMLInputElement;
sqlDetail.value=sqlCommand.value;
}
}
