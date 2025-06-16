import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  SELECTED_PLATFORM: string = "Youtube Music";

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  errorMessage: string = "";

  onSubmit() {

  }
}
