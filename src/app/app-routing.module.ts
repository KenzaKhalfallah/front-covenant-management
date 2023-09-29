import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutGlobalComponent } from './template/layout/layout.component';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ListComponent } from './covenant/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutGlobalComponent,
    children: [
      {
        path: '',
        component: ListComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
