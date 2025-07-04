import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../service/auth-service.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'merged_music_player';
  youtubeTokenPresent: boolean = false;
  spotifyTokenPresent: boolean = false;

  @ViewChild('platforms', { static: true }) platforms: any;

  ngAfterViewInit() {
    this.checkTokens();
  }

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.checkTokens()
  }

  login(platform: 'youtube' | 'spotify') {

    if (this.checkTokens(platform)) {
      this.authService.logout(platform);
      this.checkTokens()
    } else {
      this.authService.login(platform).then(r =>
        console.log(`Logged in to ${platform}`)
      );
    }
  }

  checkTokens(platform?: 'spotify' | 'youtube'): boolean {
    const youtubeToken = this.authService.getAccessToken('youtube');
    const spotifyToken = this.authService.getAccessToken('spotify');

    if (platform) {
      if (platform === 'spotify') {
        return !!spotifyToken;
      } else if (platform === 'youtube') {
        return !!youtubeToken;
      } else {
        console.error('Invalid platform specified');
        return false;
      }
    } else {
      console.log(youtubeToken)
      this.spotifyTokenPresent = !!spotifyToken;
      this.youtubeTokenPresent = !!youtubeToken;
      return this.spotifyTokenPresent || this.youtubeTokenPresent;
    }
  }
}
