import { Routes } from '@angular/router';
import { LayoutGlobalComponent } from '../template/layout/layout.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { CovenantTemplatesComponent } from './covenant-templates/covenant-templates.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';
import { AuthGuard } from 'src/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'covenant',
    component: LayoutGlobalComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create',
        component: CreateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'update/:id',
        component: UpdateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'templates',
        component: CovenantTemplatesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'templateDetails/:id',
        component: TemplateDetailsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

export default routes;
