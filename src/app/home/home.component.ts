import {Component, OnInit} from '@angular/core';
import {SearchResponse, YoutubeService} from '../../service/youtube-data-api.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  search: string = '';
  hasSearched: boolean = false;

  backgroundOvals: any[] = [];
  results: SearchResponse | undefined;

  constructor(private youtubeService: YoutubeService) {
  }


  ngOnInit() {
    this.generateBackgroundOvals();
  }

  onSearch() {
    this.hasSearched = true;

    if (this.search.trim().toLowerCase().length === 0) return;

    this.youtubeService.searchSongs(this.search).subscribe(result => {
      this.results = result
    })
  }

  generateBackgroundOvals() {
    this.backgroundOvals = [
      {
        // Purple glow on left side
        x: -15,
        y: -20,
        width: 500,
        height: 500,
        color: 'radial-gradient(circle, rgba(143, 0, 255, 0.5) 0%, rgba(143, 0, 255, 0) 70%)',
        animationDuration: 12,
        animationDelay: 0,
        rotation: 0,
        opacity: 0.6
      },
      {
        // Purple glow on left side
        x: 55,
        y: 12,
        width: 310,
        height: 310,
        color: 'radial-gradient(circle, rgba(143, 0, 255, 0.5) 0%, rgba(143, 0, 255, 0) 70%)',
        animationDuration: 12,
        animationDelay: 0,
        rotation: 0,
        opacity: 0.6
      },
      {
        // Pink/magenta glow in center
        x: 35,
        y: 80,
        width: 450,
        height: 450,
        color: 'radial-gradient(circle, rgba(255, 0, 213, 0.5) 0%, rgba(255, 0, 213, 0) 70%)',
        animationDuration: 15,
        animationDelay: 2,
        rotation: 30,
        opacity: 0.6
      },
      {
        // Pink/magenta glow in center
        x: 80,
        y: -10,
        width: 320,
        height: 320,
        color: 'radial-gradient(circle, rgba(255, 0, 213, 0.5) 0%, rgba(255, 0, 213, 0) 70%)',
        animationDuration: 15,
        animationDelay: 2,
        rotation: 30,
        opacity: 0.6
      },
      {
        // Pink/magenta glow in center
        x: 22,
        y: 25,
        width: 250,
        height: 250,
        color: 'radial-gradient(circle, rgba(255, 0, 213, 0.5) 0%, rgba(255, 0, 213, 0) 70%)',
        animationDuration: 15,
        animationDelay: 2,
        rotation: 30,
        opacity: 0.6
      },
      {
        // Green/teal glow on right
        x: 80,
        y: 80,
        width: 500,
        height: 500,
        color: 'radial-gradient(circle, rgba(0, 183, 255, 0.4) 0%, rgba(30, 215, 96, 0) 70%)',
        animationDuration: 14,
        animationDelay: 1,
        rotation: 15,
        opacity: 0.5
      },
      {
        // Green/teal glow on right
        x: -5,
        y: 65,
        width: 360,
        height: 360,
        color: 'radial-gradient(circle, rgba(0, 183, 255, 0.4) 0%, rgba(30, 215, 96, 0) 70%)',
        animationDuration: 14,
        animationDelay: 1,
        rotation: 15,
        opacity: 0.5
      }
    ];
  }
}
