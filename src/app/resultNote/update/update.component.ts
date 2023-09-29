import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultNote } from 'src/core/entities/resultNote.model';
import { ResultService } from 'src/core/services/result.service';
import { ResultNoteService } from 'src/core/services/resultnote.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  resultNote: ResultNote = new ResultNote();
  updatedTextNote: string = ''; // Initialize updatedTextNote variable
  covenantResultId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultNoteService: ResultNoteService,
    private resultService: ResultService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get the covenantResultId from the route parameters
    this.covenantResultId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    // Initialize resultNote with covenantResultId
    this.resultNote.idCovenantResult = this.covenantResultId;
    this.resultService
      .getCovenantResultById(this.covenantResultId)
      .subscribe((result) => {
        if (result.resultNotes.length > 0) {
          const resultNoteId = result.resultNotes[0].idNote;
          // Fetch the existing resultNote based on the resultNoteId
          this.resultNoteService
            .getResultNoteById(resultNoteId)
            .subscribe((resultNote) => {
              this.resultNote = resultNote;
              // Set the initial textNote in the editor
              this.updatedTextNote = resultNote.textNote;
            });
          console.log('First resultNote ID:', resultNoteId);
        } else {
          console.log('No resultNotes available for this result.');
        }
      });
  }

  public goBack() {
    window.history.back();
  }

  updateNote() {
    // Update the textNote property of the resultNote with the edited content
    this.resultNote.textNote = this.updatedTextNote;
    // Call your service to update the resultNote
    this.resultNoteService
      .updateResultNote(this.resultNote)
      .subscribe((response) => {
        if (response) {
          this._snackBar.open('Note updated Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
          window.history.back();
        } else {
          this._snackBar.open('Note updated Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
          window.history.back();
        }
      });
  }
}
