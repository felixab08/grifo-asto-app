import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  hasError = signal(false);
  isPosting = signal(false);

  loginform = this._fb.group({
    email: ['test1@google.com', [Validators.required, Validators.email]],
    password: ['Abc123', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    // if (this.loginform.invalid) {
    //   this.hasError.set(true);

    //   // Simulate a login request
    //   setTimeout(() => {
    //     this.hasError.set(false);
    //   }, 2000);
    //   return;
    // }
    // const { email, password } = this.loginform.value;
    // this._authService.login(email!, password!).subscribe({
    //   next: (resp) => {
    //     if (resp) {
    //       this._authService.user()?.roles.includes('admin')
    //         ? this._router.navigateByUrl('/admin')
    //         : this._router.navigateByUrl('/');
    //       this.isPosting.set(false);
    //       return;
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Login failed:', err);
    //     this.isPosting.set(false);
    //     this.hasError.set(true);
    //     setTimeout(() => {
    //       this.hasError.set(false);
    //     }, 2000);
    //   },
    // });
    this._router.navigateByUrl('/grifo/list-oil-store');
    // console.log('Login attempt with:', { email, password });
  }
}
