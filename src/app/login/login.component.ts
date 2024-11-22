import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  errorMessage: string = '';
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    // Initialize the form group
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe({
        next: (users) => {
          if (users.length > 0) {
            // Login successful, navigate to dashboard
            this.router.navigate(['/dashboard']);
          } else {
            // Show error if no matching user
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: (err) => {
          this.errorMessage = 'Something went wrong. Please try again later.';
          console.error(err);
        },
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched() {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}

