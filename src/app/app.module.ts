import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import {NgOptimizedImage} from "@angular/common";
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    Button,
    PrimeTemplate
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
