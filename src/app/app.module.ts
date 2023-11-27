import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule  // Add FormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]  // Add the component you want to bootstrap
})
export class AppModule { }
