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

  constructor(private platformPlayer: PlayerService, private queueManager: QueueManagerService) {
  }

  ngOnInit() {
    this._subscriptions.push(
      this.queueManager.$currentPlayingItem.subscribe(q => {
        this.currentItem = q || undefined;
        if (q?.platform === 'youtube') {
          this.ytVideoId = q.id;
        }
      }),

      this.platformPlayer.playerState$.subscribe(state => {
        this.state = state;
      }),

      this.platformPlayer.volume$.subscribe(value => {
        this.volume = value;
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

  ontimeupdate(event: any) {
    console.log(event)
  }

  protected readonly event = event;
}
