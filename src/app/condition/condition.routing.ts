import { Routes } from '@angular/router';
import { LayoutComponent } from '../template/layout/layout.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { CovenantFilterComponent } from './covenant-filter/covenant-filter.component';

const routes: Routes = [
  {
    path: 'condition',
    component: LayoutComponent,
    children: [
      {
        path: 'covenantFilter',
        component: CovenantFilterComponent,
      },
      {
        path: 'list/:id',
        component: ListComponent,
      },
      {
        path: 'create/:id',
        component: CreateComponent,
      },
      {
        path: 'update/:id',
        component: UpdateComponent,
      },
    ],
  },
];

export default routes;
