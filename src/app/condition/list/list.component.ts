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
import { ConditionService } from 'src/core/services/condition.service';
import { ResultService } from 'src/core/services/result.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  conditions: Array<CovenantCondition> = [];
  results: Array<CovenantResult> = [];
  search: FormControl = new FormControl();
  displayedColumns: string[] = [
    //'idCondition',
    'startDateCondition',
    'endDateCondition',
    'lowerLimitCondition',
    'upperLimitCondition',
    'contractualFlagCondition',
    'exceptionFlagCondition',
    'breachWeight',
    'covenantResult',
    'actions',
  ];
  dataSource!: MatTableDataSource<CovenantCondition>;

  constructor(
    private conditionService: ConditionService,
    private resultService: ResultService,
    private route: ActivatedRoute, // Inject ActivatedRoute to get the covenant ID
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.search.valueChanges.subscribe((value) => {
      this.loadConditions();
      this.paginator.pageIndex = 0;
    });
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadConditions();
  }

  loadConditions(): void {
    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.conditionService
      .filterConditionsByIdCovenant(covenantId)
      .subscribe((conditions) => {
        console.log(conditions);
        this.conditions = conditions;

        if (this.search.value) {
          // Apply client-side filtering
          this.conditions = this.conditions.filter((condition) => {
            let res = '';
            if (condition.breachWeight === 1) {
              res = 'major';
            } else if (condition.breachWeight === 2) {
              res = 'moderate';
            } else if (condition.breachWeight === 3) {
              res = 'minor';
            }
            return res.includes(this.search.value);
          });
        }

        // Sort the data based on the active sorting column and direction
        if (this.sort.active && this.sort.direction) {
          this.conditions = this.conditions.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            const column = this.sort.active;
            switch (column) {
              case 'startDateCondition':
                const startDateA = new Date(a.startDateCondition).getTime();
                const startDateB = new Date(b.startDateCondition).getTime();
                return isAsc
                  ? startDateA - startDateB
                  : startDateB - startDateA;
              case 'endDateCondition':
                const endDateA = new Date(a.endDateCondition).getTime();
                const endDateB = new Date(b.endDateCondition).getTime();
                return isAsc ? endDateA - endDateB : endDateB - endDateA;
              case 'covenantResult':
                if (a.covenantResult.resultStatus === 1) {
                  // 'Passed' condition comes first if resultStatus is 1
                  return isAsc ? -1 : 1;
                } else if (a.covenantResult.resultStatus === 2) {
                  // 'Failed' condition comes first if resultStatus is 2
                  return isAsc ? 1 : -1;
                }
                // For other cases, return 0 to maintain their order
                return 0;
              default:
                return 0;
            }
          });
        }

        const requests = this.conditions
          .filter((condition) => condition.covenantResult)
          .map((condition) => {
            return new Promise<CovenantResult>((resolve) => {
              this.resultService
                .getCovenantResultById(condition.covenantResult.idResult)
                .subscribe((result) => {
                  resolve(result);
                });
            });
          });
        // Use Promise.all to wait for all requests to complete
        Promise.all(requests).then((results) => {
          results.forEach((result, index) => {
            this.conditions = [...this.conditions];
            this.conditions[index].covenantResult = result;
            console.log('RESULT    :   ', result);
          });

          // Trigger change detection manually
          this.changeDetectorRef.detectChanges();

          this.dataSource = new MatTableDataSource(this.conditions);
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  /**
   * sortData
   */
  public sortData(event: any) {
    this.loadConditions();
  }

  public goToAddCondition() {
    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.router.navigate(['/condition/create/', covenantId]);
  }

  /**
   * gotoUpdate
   */
  public gotoUpdate(id: number) {
    this.router.navigate(['/condition/update/', id]);
  }

  /**
   * gotoNote
   */
  public gotoNote(id: number) {
    this.resultService.getCovenantResultById(id).subscribe((result) => {
      console.log('Note   :   ', result.resultNotes);
      if (result.resultNotes.length === 0) {
        this.router.navigate(['/resultNote/create/', id]);
      } else if (result.resultNotes.length !== 0) {
        this.router.navigate(['/resultNote/update/', id]);
      } else {
        console.log('Erreur when navigate to Note ! ');
      }
    });
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
        message: 'Do you want to delete this condition ?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        this.conditionService.deleteCovenantCondition(id).subscribe((res) => {
          this.loadConditions();
          this._snackBar.open('Condition successfully deleted!!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        });
      }
    });
  }
}
