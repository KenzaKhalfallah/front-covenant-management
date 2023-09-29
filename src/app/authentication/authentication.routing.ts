import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AccountComponent } from './account/account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'createaccount',
    component: AccountComponent,
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'layout',
    component: LayoutComponent,
  },
];
export default routes;
