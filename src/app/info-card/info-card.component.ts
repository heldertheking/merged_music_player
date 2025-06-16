import {Component, Input, OnInit} from '@angular/core';
import {interval} from 'rxjs';

@Component({
  selector: 'app-info-card',
  standalone: false,
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss'
})
export class InfoCardComponent implements OnInit{
  @Input() type: 'disclaimer' | 'info' | 'warn' | 'error' = 'disclaimer';
  @Input() text: string = '';
  @Input() duration: number = 8;
  progress: number = 0;

  ngOnInit() {
  }

  get icon(): string {
    switch (this.type) {
      case 'info': return 'pi pi-info-circle';
      case 'warn': return 'pi pi-exclamation-triangle';
      case 'error': return 'pi pi-times-circle';
      default: return 'pi pi-exclamation-triangle';
    }
  }
}
