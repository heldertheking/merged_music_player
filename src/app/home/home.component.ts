import {Component, OnInit} from '@angular/core';
import {MergedSearchResponse, MergedSearchRequest, MergedSearchRequestBuilder} from '../../model/MergedSearch.model';
import {MergerService} from '../../service/merger.service';

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

  constructor(private service: MergerService) {
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
      }
    )
  }
}
