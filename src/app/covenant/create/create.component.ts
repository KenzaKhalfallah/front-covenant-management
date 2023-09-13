import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { CounterParty } from 'src/core/entities/counterparty.model';
import { Covenant, LinkedLineItemEnum } from 'src/core/entities/covenant.model';
import { CounterpartyService } from 'src/core/services/counterparty.service';
import { CovenantService } from 'src/core/services/covenant.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  creatForm!: FormGroup;
  _onDestroy!: Subject<void>;
  covenant!: Covenant;
  linkedLineItems: LinkedLineItemEnum[] = [];

  counterparties!: Array<CounterParty>;
  constructor(
    private covenantService: CovenantService,
    private counterpartyService: CounterpartyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnDestroy() {
    //this._onDestroy.next();
    //this._onDestroy.complete();
  }

  ngOnInit(): void {
    // Initialize the form, create it and fetch counterparties
    this.initializeForm();
    this.fetchCounterparties();

    // Subscribe to changes in the "Type Covenant" dropdown
    this.creatForm.get('typeCovenant')?.valueChanges.subscribe((value) => {
      // Update the linkedLineItems based on the selected type
      this.linkedLineItems = this.updateLinkedLineItems(value);
    });
  }

  get form() {
    return this.creatForm.controls;
  }

  private initializeForm(): void {
    // Initialize form fields
    this.creatForm = this.formBuilder.group({
      nameCovenant: ['', [Validators.required, Validators.minLength(3)]],
      categoryCovenant: [0, [Validators.required]],
      descriptionCovenant: ['', [Validators.required, Validators.minLength(4)]],
      typeCovenant: [0, [Validators.required]],
      periodTypeCovenant: [0, [Validators.required]],
      statementSourceCovenant: [0, [Validators.required]],
      linkedLineItem: [0, [Validators.required]],
      idCounterparty: [0, [Validators.required]],
    });
  }

  fetchCounterparties(): void {
    this.counterpartyService
      .getAllCounterparties()
      .subscribe((counterparties) => {
        console.log(counterparties);
        this.counterparties = counterparties;
      });
  }

  public create() {
    this.covenant = this.creatForm.value;
    console.log(this.covenant);
    this.covenantService.createCovenant(this.covenant).subscribe((response) => {
      if (response) {
        this._snackBar.open('Covenant Created Successfully', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
      } else {
        this._snackBar.open('All fields are required !', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
      }
    });

    // Clear the form fields and reset to default values
    this.initializeForm();
    // Subscribe to changes in the "Type Covenant" dropdown
    this.creatForm.get('typeCovenant')?.valueChanges.subscribe((value) => {
      // Update the linkedLineItems based on the selected type
      this.linkedLineItems = this.updateLinkedLineItems(value);
    });
  }

  // Method to update the available linkedLineItems based on the selected type
  public updateLinkedLineItems(value: number): LinkedLineItemEnum[] {
    if (value === 1) {
      return [
        LinkedLineItemEnum.EBITDA,
        LinkedLineItemEnum.EquityRatio,
        LinkedLineItemEnum.DebtServiceCoverageRatio,
        LinkedLineItemEnum.OperatingCashFlow,
        LinkedLineItemEnum.CurrentRatio,
        LinkedLineItemEnum.GrossProfit,
      ];
    } else if (value === 2) {
      return [
        LinkedLineItemEnum.CurrentRatio,
        LinkedLineItemEnum.GrossProfit,
        LinkedLineItemEnum.DebtToEquityRatio,
        LinkedLineItemEnum.InterestCoverageRatio,
        LinkedLineItemEnum.InventoryTurnover,
      ];
    } else {
      // Handle other cases or provide a default list
      return [];
    }
  }
}
