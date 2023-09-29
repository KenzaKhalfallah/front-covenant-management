import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { ResultNote } from 'src/core/entities/resultNote.model';
import { ResultNoteService } from 'src/core/services/resultnote.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  resultNote: ResultNote = new ResultNote();
  covenantResultId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultNoteService: ResultNoteService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get the covenantResultId from the route parameters
    this.covenantResultId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    // Initialize resultNote with covenantResultId
    this.resultNote.idCovenantResult = this.covenantResultId;
  }

  public goBack() {
    window.history.back();
  }

  saveNote() {
    // Call your service to create the resultNote
    this.resultNoteService
      .createResultNote(this.covenantResultId, this.resultNote)
      .subscribe((response) => {
        if (response) {
          this._snackBar.open('Note added Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
          window.history.back();
        } else {
          this._snackBar.open('Error create Note !', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        }
      });
  }
}
