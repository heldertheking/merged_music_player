import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../service/auth-service.service';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Processing authentication...</p>'
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.handleAuthCallback();
    this.router.navigate(['/']).then(() => {});
  }
}
