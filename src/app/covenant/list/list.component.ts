import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { QueryBuilder } from 'odata-query-builder';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

import { CovenantService } from '../../../core/services/covenant.service';
import { Covenant } from '../../../core/entities/covenant.model';
import { CounterpartyService } from 'src/core/services/counterparty.service';
import { CounterParty } from 'src/core/entities/counterparty.model';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { PdfService } from 'src/core/services/pdf.service';
import { forkJoin } from 'rxjs';
import { ConditionService } from 'src/core/services/condition.service';
import { ResultService } from 'src/core/services/result.service';

@Component({
  selector: 'app-covenant-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, AfterViewInit {
  covenants: Array<Covenant> = [];
  counterparties: Array<CounterParty> = [];
  search: FormControl = new FormControl();
  displayedColumns: string[] = [
    //'idCovenant',
    'nameCovenant',
    'categoryCovenant',
    'descriptionCovenant',
    'typeCovenant',
    'periodTypeCovenant',
    'statementSourceCovenant',
    'linkedLineItem',
    'idCounterparty',
    'actions',
  ];
  dataSource!: MatTableDataSource<Covenant>;
  covenant!: Covenant;

  constructor(
    private covenantService: CovenantService,
    private counterpartyService: CounterpartyService,
    private conditionService: ConditionService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.search.valueChanges.subscribe((value) => {
      this.loadCovenants();
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
    this.loadCovenants();
  }

  //To sort type covenant
  public compareTypeCovenant(a: Covenant, b: Covenant, isAsc: boolean): number {
    const typeA = a.typeCovenant === 1 ? 'Affirmative' : 'Negative';
    const typeB = b.typeCovenant === 1 ? 'Affirmative' : 'Negative';

    return typeA.localeCompare(typeB) * (isAsc ? 1 : -1);
  }

  loadCovenants(): void {
    this.covenantService.getAllCovenants().subscribe((covenants) => {
      console.log(covenants);
      this.covenants = covenants;

      if (this.search.value) {
        // Apply client-side filtering
        this.covenants = this.covenants.filter((covenant) =>
          covenant.nameCovenant.includes(this.search.value)
        );
      }

      // Sort the data based on the active sorting column and direction
      if (this.sort.active && this.sort.direction) {
        this.covenants = this.covenants.sort((a, b) => {
          const isAsc = this.sort.direction === 'asc';
          const column = this.sort.active;
          switch (column) {
            case 'nameCovenant':
              return isAsc
                ? a.nameCovenant.localeCompare(b.nameCovenant)
                : b.nameCovenant.localeCompare(a.nameCovenant);
            case 'typeCovenant':
              return this.compareTypeCovenant(a, b, isAsc); // Use the custom sorting function
            default:
              return 0;
          }
        });
      }

      const requests = this.covenants
        .filter((covenant) => covenant.idCounterparty)
        .map((covenant) => {
          return new Promise<CounterParty>((resolve) => {
            this.counterpartyService
              .getCounterpartyById(covenant.idCounterparty)
              .subscribe((counterparty) => {
                resolve(counterparty);
              });
          });
        });
      // Use Promise.all to wait for all requests to complete
      Promise.all(requests).then((counterparties) => {
        counterparties.forEach((counterparty, index) => {
          this.covenants = [...this.covenants];
          this.covenants[index].counterParty = counterparty;
        });

        // Trigger change detection manually
        this.changeDetectorRef.detectChanges();

        this.dataSource = new MatTableDataSource(this.covenants);
        this.dataSource.paginator = this.paginator;
      });
    });
  }
  /**
   * sortData
   */
  public sortData(event: any) {
    this.loadCovenants();
  }

  /**
   * gotoUpdate
   */
  public gotoUpdate(id: number) {
    this.router.navigate(['/covenant/update/', id]);
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
        message: 'Do you want to delete this covenant ?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        this.covenantService.deleteCovenant(id).subscribe((res) => {
          this.loadCovenants();
          this._snackBar.open('Covenant successfully deleted!!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        });
      }
    });
  }

  /**
   * download the covenant as a pdf file
   */
  download(id: number) {
    // Use forkJoin to combine both observables
    forkJoin([
      this.covenantService.getCovenantById(id),
      this.conditionService.filterConditionsByIdCovenant(id),
    ]).subscribe(([covenantData, conditionData]) => {
      this.counterpartyService
        .getCounterpartyById(covenantData.idCounterparty)
        .subscribe((counterpartyData) => {
          // Generate the PDF
          const pdfBlob = this.pdfService.generatePdf(
            counterpartyData,
            covenantData,
            conditionData
          );
          // Create a blob URL for the PDF
          const blobUrl = URL.createObjectURL(pdfBlob);
          // Create an anchor element to trigger the download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'Covenant.pdf';
          a.click();
          // Clean up the blob URL
          URL.revokeObjectURL(blobUrl);
        });
    });
  }
}
