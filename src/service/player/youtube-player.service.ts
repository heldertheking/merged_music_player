import {Injectable} from '@angular/core';
import {YouTubePlayer} from '@angular/youtube-player';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubePlayerService {
  private player: YouTubePlayer | undefined;
  public _playbackTime: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  setPlayer(player: YouTubePlayer) {
    this.player = player;
    this.player.setVolume(100)
  }

  play() {
    this.player?.playVideo();
  }

  pause() {
    this.player?.pauseVideo();
  }

  stop() {
    this.player?.stopVideo();
  }

  setVolume(volume: number) {
    if (this.player) {
      this.player.setVolume(volume);
    } else {
      console.error('YouTube player is not initialized.');
    }
  }
}
