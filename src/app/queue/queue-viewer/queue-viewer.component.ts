import {Component} from '@angular/core';
import {QueueItem, QueueManagerService} from '../../../service/player/queue-manager.service';

@Component({
  selector: 'app-queue-viewer',
  standalone: false,
  templateUrl: './queue-viewer.component.html',
  styleUrl: './queue-viewer.component.scss'
})
export class QueueViewerComponent {
  protected queue: QueueItem[] = [];
  protected currentPlayingItem: QueueItem | undefined;

  constructor(private queueManager: QueueManagerService) {
    this.queueManager.$queue.subscribe(q => {
      this.queue = q
    });

    this.queueManager.$currentPlayingItem.subscribe(c => {
      this.currentPlayingItem = c || undefined;
    })
  }

  removeFromQueue(item: QueueItem, index: number) {
    this.queueManager.removeFromQueue(item, index)
  }

  playItem(item: QueueItem) {
    // TODO: Click on item to play it
  }
}
