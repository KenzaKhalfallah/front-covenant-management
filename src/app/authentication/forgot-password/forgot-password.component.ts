import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  addressForm!: FormGroup;
  hide = true;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  get form() {
    return this.addressForm.controls;
  }

  private initializeForm(): void {
    this.addressForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  login() {
    console.log(this.addressForm.value.email);

    const address = this.addressForm.value.email;
  }
}
