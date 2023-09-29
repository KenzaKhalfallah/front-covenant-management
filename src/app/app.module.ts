import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateModule } from './template/template.module';
import { HomeComponent } from './home/home.component';
import { CovenantModule } from './covenant/covenant.module';
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule } from '@angular/material/dialog';
import { ConditionModule } from './condition/condition.module';
import { ResultNoteModule } from './resultNote/resultNote.module';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    CovenantModule,
    TemplateModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    QueryBuilderModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ConditionModule,
    ResultNoteModule,
    QuillModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // Position of the toast
      timeOut: 5000, // Duration to display the toast in milliseconds
      progressBar: true, // Show a progress bar
      closeButton: true, // Show a close button
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
