import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CovenantCondition } from 'src/core/entities/covenantCondition.model';
import { CovenantResult } from 'src/core/entities/covenantResult.model';
import { ResultNote } from 'src/core/entities/resultNote.model';
import { ConditionService } from 'src/core/services/condition.service';
import { ResultService } from 'src/core/services/result.service';
import { ResultNoteService } from 'src/core/services/resultnote.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  notes: Array<ResultNote> = [];
  search: FormControl = new FormControl();
  displayedColumns: string[] = [
    //'idCondition',
    'textNote',
    'actions',
  ];
  dataSource!: MatTableDataSource<ResultNote>;

  constructor(
    private noteService: ResultNoteService,
    private resultService: ResultService,
    private route: ActivatedRoute, // Inject ActivatedRoute to get the covenant ID
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.search.valueChanges.subscribe((value) => {
      this.loadNotes();
      this.paginator.pageIndex = 0;
    });
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.loadNotes();
  }

  loadNotes(): void {
    // Get the covenant ID from the route params
    const resultId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.noteService.filterNotesByIdResult(resultId).subscribe((notes) => {
      console.log(notes);
      this.notes = notes;
      if (this.search.value) {
        // Apply client-side filtering
        this.notes = this.notes.filter((note) => {
          note.textNote.includes(this.search.value);
        });
      }

      // Trigger change detection manually
      this.changeDetectorRef.detectChanges();

      this.dataSource = new MatTableDataSource(this.notes);
      this.dataSource.paginator = this.paginator;
    });
  }

  public goBack() {
    window.history.back();
  }

  public goToAddNote() {
    const resultId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.router.navigate(['/resultNote/create/', resultId]);
  }

  /**
   * gotoUpdate
   */
  public gotoUpdate(id: number) {
    this.router.navigate(['/resultNote/update/', id]);
  }

  /**
   * Supp()
   *  ouverture de POP UP de Suppression
   */
  supp(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '39%';
    dialogConfig.height = '30%';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: '30px' },
      data: {
        message: 'Do you want to delete this note ?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        this.noteService.deleteResultNote(id).subscribe((res) => {
          this.loadNotes();
          this._snackBar.open('Note successfully deleted!!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        });
      }
    });
  }
}
