import {Component} from '@angular/core';
import {SearchResultItem, YoutubeService} from '../service/youtube-data-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'merged_music_player';

  searchResults: SearchResultItem[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private youtubeService: YoutubeService) {
  }

  ngOnInit(): void {
    // You can call the service's methods here, e.g., in ngOnInit or in response to user actions.
    // this.searchForSongs('Angular Tutorial'); // Example: Search for "Angular Tutorial" on component initialization
  }

  searchForSongs(query: string): void {
    this.loading = true;
    this.error = null; // Clear any previous errors
    this.searchResults = []; // Clear previous search results

    this.youtubeService.searchSongs(query).subscribe({
      next: (response) => {
        this.searchResults = response.items;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }
}
