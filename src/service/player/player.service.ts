import {Injectable, OnDestroy} from '@angular/core';
import {YoutubePlayerService} from './youtube-player.service';
import {AuthService} from '../auth-service.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {YouTubePlayer} from '@angular/youtube-player';
import {QueueItem, QueueManagerService} from './queue-manager.service';
// import { SpotifyPlayerService } from './spotify-player.service'; // Reserved

export type Platform = 'youtube' | 'spotify';
export type PlayerState = 'playing' | 'paused' | 'stopped';

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements OnDestroy {
  private _subscription: Subscription[] = []; // Reserved for future use

  private currentItem: QueueItem | undefined;
  private queue: QueueItem[] = [];

  public playerState$ = new BehaviorSubject<PlayerState>('stopped');
  public volume$ = new BehaviorSubject<number>(50); // Default volume set to 100%

  constructor(
    private youtubeService: YoutubePlayerService, // private spotifyService: SpotifyPlayerService,
    private auth: AuthService,
    private queueManager: QueueManagerService
  ) {
    this._subscription.push(
      this.queueManager.$queue.subscribe(q => {
        this.queue = q;
      }),

      this.queueManager.$currentPlayingItem.subscribe(item => {
        this.currentItem = item || undefined;
      })
    )
  }

  ngOnDestroy() {
    this._subscription.forEach(sub => sub.unsubscribe());
  }

  play(inItem?: QueueItem) {
    if (inItem) {
      this.queueManager.setCurrentPlayingItem(inItem);
    } else if (!this.currentItem && this.queue.length === 0) {
      return;
    }

    if (this.currentItem?.platform === 'youtube') {
      this.playerState$.next('playing');
      this.youtubeService.play();
    } else if (this.currentItem?.platform === 'spotify') {
      // this.playerState$.next('playing');
      // this.spotifyService.play(this.getUserToken('spotify'), this.currentItem.id);
      console.warn('Spotify playback is not implemented yet.');
    }
  }

  pause() {
    if (!this.currentItem) return;
    this.playerState$.next('paused');
    if (this.currentItem.platform === 'youtube') {
      this.youtubeService.pause();
    }
    // else if (this.currentItem.platform === 'spotify') {
    //   this.spotifyService.pause();
    // }
  }

  stop() {
    if (!this.currentItem) return;
    if (this.currentItem.platform === 'youtube') {
      this.youtubeService.stop();
    }
    // else if (this.currentItem.platform === 'spotify') {
    //   this.spotifyService.stop();
    // }
  }

  nextTrack() {
    this.queueManager.nextTrack()
  }

  previousTrack() {
    this.queueManager.previousTrack()
  }

  setVolume(volume: number) {
    if (volume < 0 || volume > 100) {
      console.error('Volume must be between 0 and 100.');
      return;
    }

    this.volume$.next(volume);
    if (this.currentItem?.platform === 'youtube') {
      this.youtubeService.setVolume(volume);
    }
    // else if (this.currentItem?.platform === 'spotify') {
    //   this.spotifyService.setVolume(volume / 100);
    // } else {
    //   console.error('Volume control is not available for the current platform.');
    //
  }

  setYTPlayer(target: YouTubePlayer) {
    this.youtubeService.setPlayer(target)
  }
}
