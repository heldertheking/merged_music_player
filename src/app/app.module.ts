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
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef} from "@angular/material/table";
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MusicPlayerComponent,
    InfoCardComponent,
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
    ReactiveFormsModule,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    AuthCallbackComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
