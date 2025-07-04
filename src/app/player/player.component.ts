import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlayerService, PlayerState} from '../../service/player/player.service';
import {YouTubePlayer} from '@angular/youtube-player';
import {Subscription} from 'rxjs';
import {QueueItem, QueueManagerService} from '../../service/player/queue-manager.service';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('youtubePlayer', {static: false})
  set youtubePlayer(player: YouTubePlayer | undefined) {
    this._youtubePlayer = player
    if (player) {
      this.platformPlayer.setYTPlayer(player);
      console.log('YouTube player initialized:', player);
    }
  }

  private _subscriptions: Subscription[] = [];

  public currentItem?: QueueItem;

  private _youtubePlayer?: YouTubePlayer;

  protected state: PlayerState = 'paused';
  protected volume: number = 50;
  protected isMuted: boolean = false; // Track mute state
  protected playbackTime: number = 0;
  private previousVolume: number = 50; // Store previous volume for toggling mute
  ytVideoId: string = "";

  protected crrSongProgress: number = 0; // Progress of the current song in seconds
  private PLAYBACK_TIME_UPDATE_INTERVAL: any = null; // 1 second

  constructor(private platformPlayer: PlayerService, private queueManager: QueueManagerService) {
  }

  ngOnInit() {
    this._subscriptions.push(
      this.queueManager.$currentPlayingItem.subscribe(q => {
        this.currentItem = q || undefined;
        if (q?.platform === 'youtube') {
          this.ytVideoId = q.id;
          this.startTimeInterval()
        } else {
          this.ytVideoId = '';
          this._youtubePlayer?.pauseVideo()
          clearInterval(this.PLAYBACK_TIME_UPDATE_INTERVAL)
          this.crrSongProgress = 0; // Reset progress when not playing YouTube video
        }
      }),

      this.platformPlayer.playerState$.subscribe(state => {
        this.state = state;
        if (state === YT.PlayerState.ENDED.toString()) {
          this.platformPlayer.nextTrack();
        }
      }),

      this.platformPlayer.volume$.subscribe(value => {
        this.volume = value;
        this._youtubePlayer?.setVolume(this.volume)
      }),
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePlayState() {
    switch (this.state) {
      case 'playing': this.platformPlayer.pause(); break
      case 'paused': this.platformPlayer.play(); break
      case 'stopped': this.platformPlayer.play(); break
      default: console.error('Invalid player state: ', this.state);
    }
  }

  previousTrack() {
    this.platformPlayer.previousTrack()
  }

  nextTrack() {
    this.platformPlayer.nextTrack()
  }

  setVolume(volume: number, fromToggle: boolean) {
    if (this.isMuted && !fromToggle) {
      this.isMuted = false;
    }
    this.platformPlayer.setVolume(volume);
  }

  toggleMute() {
    if (this.volume > 0) {
      this.previousVolume = this.volume; // Store current volume before muting
      this.isMuted = true; // Toggle mute state
      this.setVolume(0, true);
    } else {
      this.isMuted = false; // Toggle mute state
      this.setVolume(this.previousVolume, true); // Reset to default volume, can be adjusted as needed
    }
  }

  startTimeInterval() {
    this.PLAYBACK_TIME_UPDATE_INTERVAL = setInterval(() => {
        const currentTime = this._youtubePlayer?.getCurrentTime();
        const duration = this._youtubePlayer?.getDuration();
        if (duration && duration > 0 && currentTime) {
          this.crrSongProgress = (currentTime / duration) * 100;
        }
    },  500); // Update every second
  }
}
