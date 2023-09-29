import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Account } from 'src/core/entities/acount.model';
import { AccountService } from 'src/core/services/account.service';
import { confirmPasswordValidator } from '../validators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  createAccountForm!: FormGroup;
  account!: Account;
  hide = true;
  submitted: boolean = false;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  get form() {
    return this.createAccountForm.controls;
  }

  private initializeForm(): void {
    this.createAccountForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        telephone: ['', [Validators.required, Validators.minLength(8)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        ConditionsAccepted: [false, [Validators.requiredTrue]],
      },
      {
        validator: confirmPasswordValidator(), // Apply the custom validator here
      }
    );
  }

  public createAccount(event: Event) {
    event.preventDefault();
    if (this.createAccountForm.invalid) {
      // Display a snackbar message for validation errors
      this._snackBar.open('Please fill out the form correctly.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
      });
      return; // Exit the function if the form is invalid
    }
    this.account = this.createAccountForm.value;
    console.log(this.account);
    this.accountService.createAccount(this.account).subscribe((response) => {
      if (response) {
        this._snackBar.open('Account Created Successfully', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
        this.router.navigate(['/login']);
      } else {
        this._snackBar.open('All fields are required !', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
      }
    });

    // Clear the form fields and reset to default values
    this.initializeForm();
  }
}
