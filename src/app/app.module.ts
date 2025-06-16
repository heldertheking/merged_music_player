import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {NgOptimizedImage} from "@angular/common";
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {MusicPlayerComponent} from './music-player/music-player.component';

import {YouTubePlayerModule} from '@angular/youtube-player';
import {InfoCardComponent} from './info-card/info-card.component';
import {MatProgressBar} from '@angular/material/progress-bar';
import {LoginPageComponent} from './login-page/login-page.component';
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MusicPlayerComponent,
    InfoCardComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    Button,
    PrimeTemplate,
    YouTubePlayerModule,
    MatProgressBar,
    MatTabGroup,
    MatTab,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
