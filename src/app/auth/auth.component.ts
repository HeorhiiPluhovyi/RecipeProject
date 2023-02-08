import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.interfaces';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form!: FormGroup;
  loginMode = true;
  isShowPassword = false;
  isLoading = false;
  error!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ]
      ]
    })
  }

  onSwitchMode(): void {
    this.loginMode = !this.loginMode;
    this.form.reset()
  }

  onShowPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const { email: email, password: password } = this.form.value;
    let authObservable: Observable<AuthResponseData> = this.loginMode
      ? this.authService.login(email, password)
      : this.authService.singup(email, password);

    authObservable.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      },
      errorMassage => {
        this.error = errorMassage;
        console.log(errorMassage);
        this.isLoading = false;

        setTimeout(() => {
          this.error = '';
        }, 15000)
      }
    )
  }

  onHandleError() {
    this.error = null;
  }
}
