import { Routes } from '@angular/router';
import { LayoutGlobalComponent } from '../template/layout/layout.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { CovenantFilterComponent } from './covenant-filter/covenant-filter.component';
import { AuthGuard } from 'src/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'condition',
    component: LayoutGlobalComponent,
    children: [
      {
        path: 'covenantFilter',
        component: CovenantFilterComponent,
        canActivate: [AuthGuard],
      },
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
