import {Component, OnInit} from '@angular/core';
import {MergedSearchRequestBuilder, MergedSearchResponse} from '../../model/MergedSearch.model';
import {MergerService} from '../../service/merger.service';
import {QueueItem, QueueManagerService} from '../../service/player/queue-manager.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  search: string = '';
  hasSearched: boolean = false;

  nextPageToken: string = '';
  prevPageToken: string = '';
  results: MergedSearchResponse = {items: []};

  constructor(private service: MergerService, private queueManager: QueueManagerService) {
  }

  ngOnInit() {
    this.results = {
      items: []
    };
  }

  onSearch() {
    this.hasSearched = true;

    if (this.search.trim().toLowerCase().length === 0) return;

    let request = new MergedSearchRequestBuilder()
      .setQuery(this.search)
      .setLimit(12)
      .build();

    this.service.search(request).subscribe(results => {
        console.log('Search results:', results)
        this.results = results;
        console.log(`ID: ${results.items[0].id} \n Title: ${results.items[0].title} \n thumbnail: ${results.items[0].thumbnailUrl[0]} \n Platform: ${results.items[0].platform}`);
      }
    )
  }

  onClick(_t16: { id: string; title: string; description: string; thumbnailUrl: string[]; channelTitle?: string; publishedAt?: string; platform: "youtube" | "spotify" | "both"; }, event: any) {
    const item: QueueItem = {
      id: _t16.id,
      title: _t16.title,
      artist: _t16.channelTitle || 'Unknown Artist',
      thumbnailUrl: _t16.thumbnailUrl[0],
      platform: _t16.platform === "both" ? "youtube" : _t16.platform,
    };

    if (event.shiftKey) {
      this.queueManager.addToQueue(item);
    } else {
      this.queueManager.setCurrentPlayingItem(item)
    }
  }
}
