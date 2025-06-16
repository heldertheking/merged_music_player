import { Component } from '@angular/core';

@Component({
  selector: 'app-music-player',
  standalone: false,
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss'
})
export class MusicPlayerComponent {
  videoId: string = 'p5TGgp8t440';
  playerVars = {
    controls: 0,
    disablekb: 1,
    modestbranding: 1,
    fs: 0,
    rel: 0,
    showinfo: 0
  };

  onPlayerReady(event: any) {
    console.log('Player is ready');
    event.target.playVideo();
  }

  play(player: any) {
    player.playVideo();
  }

  pause(player: any) {
    player.pauseVideo();
  }

  stop(player: any) {
    player.stopVideo();
  }

  loadVideo(player: any, videoId: string) {
    player.loadVideoById(videoId);
  }
}

