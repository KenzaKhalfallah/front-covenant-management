import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { LayoutGlobalComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    LayoutGlobalComponent,
  ],
  exports: [HeaderComponent, MenuComponent, FooterComponent],
  imports: [CommonModule, RouterModule],
})
export class TemplateModule {}
