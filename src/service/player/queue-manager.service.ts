import {Injectable} from '@angular/core';
import {Platform} from './player.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueManagerService {
  private _queue: QueueItem[] = [];
  private _currentPlayingItem: QueueItem | null = null;

  public $currentPlayingItem: BehaviorSubject<QueueItem | null> = new BehaviorSubject<QueueItem | null>(this._currentPlayingItem);
  public $queue: BehaviorSubject<QueueItem[]> = new BehaviorSubject<QueueItem[]>(this._queue);

  addToQueue(item: QueueItem) {
    this._queue.push(item)
    if (!this._currentPlayingItem) {
      this._currentPlayingItem = item;
      this.$currentPlayingItem.next(this._currentPlayingItem);
    }
  }

  removeFromQueue(item: QueueItem, index: number) {
    if (this._queue[index] === item) {
      this._queue.splice(index, 1);
      this.$queue.next(this._queue);
      if (this._currentPlayingItem === item) {
        this._currentPlayingItem = this._queue[this._queue.length - 1] || null;
        this.$currentPlayingItem.next(this._currentPlayingItem);
      }
    }
  }

  clearQueue() {
    this._queue = [];
    this._currentPlayingItem = null

    this.$queue.next([]);
    this.$currentPlayingItem.next(null);
  }

  setCurrentPlayingItem(inItem: QueueItem) {
    this.clearQueue()
    this._queue.push(inItem)
    this._currentPlayingItem = inItem;

    this.$currentPlayingItem.next(this._currentPlayingItem);
    this.$queue.next(this._queue)
  }

  addToStorage() {
    const data = {
      queue: this._queue,
      currentPlayingItem: this._currentPlayingItem,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };
    localStorage.setItem('lastPlayerQueue', JSON.stringify(data));
  }
}

export interface QueueItem {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  platform: Platform;
}
