import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from 'src/core/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // @ts-ignore
  loginForm!: FormGroup;
  hide = true;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Check if "Remember me" option is enabled and fill the email field
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
      const savedEmail = localStorage.getItem('email');
      this.loginForm.patchValue({ email: savedEmail });
    }
  }

  get form() {
    return this.loginForm.controls;
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  public login(event: Event) {
    event.preventDefault();
    this.submitted = true;

    // Get all accounts and filter by email and password
    this.accountService.getAllAccounts().subscribe(
      (accounts) => {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        const rememberMe = this.loginForm.value.rememberMe;
        const user = accounts.find(
          (account) => account.email === email && account.password === password
        );
        if (user) {
          localStorage.setItem('user', user.name);
          localStorage.setItem(
            'token',
            ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
          );
          localStorage.setItem('email', user.email);
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }
          this.router.navigate(['/covenant/list']);
        } else {
          this._snackBar.open('Account did not exist !', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
