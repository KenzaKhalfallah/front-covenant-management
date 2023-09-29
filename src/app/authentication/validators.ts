import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';

export function confirmPasswordValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      if (confirmPassword.errors) {
        confirmPassword.setErrors({
          ...confirmPassword.errors,
          passwordMismatch: true,
        });
      } else {
        confirmPassword.setErrors({ passwordMismatch: true });
      }

      return { passwordMismatch: true };
    } else {
      if (
        confirmPassword &&
        confirmPassword.errors &&
        confirmPassword.errors['passwordMismatch']
      ) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        } else {
          confirmPassword.setErrors({ ...confirmPassword.errors });
        }
      }

      return null;
    }
  };
}
