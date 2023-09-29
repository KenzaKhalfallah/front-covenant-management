import { Routes } from '@angular/router';
import { LayoutGlobalComponent } from '../template/layout/layout.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { AuthGuard } from 'src/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'resultNote',
    component: LayoutGlobalComponent,
    children: [
      {
        path: 'list/:id',
        component: ListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create/:id',
        component: CreateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'update/:id',
        component: UpdateComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

export default routes;
