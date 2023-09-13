import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CounterParty } from 'src/core/entities/counterparty.model';
import { Covenant, LinkedLineItemEnum } from 'src/core/entities/covenant.model';
import { CounterpartyService } from 'src/core/services/counterparty.service';
import { CovenantService } from 'src/core/services/covenant.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit, OnDestroy {
  updateForm!: FormGroup;
  _onDestroy!: Subject<void>;
  covenant!: Covenant;
  linkedLineItems: LinkedLineItemEnum[] = [];
  counterparties!: Array<CounterParty>;

  constructor(
    private covenantService: CovenantService,
    private counterpartyService: CounterpartyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // Inject ActivatedRoute to get the covenant ID
    private _snackBar: MatSnackBar
  ) {}

  ngOnDestroy() {
    //this._onDestroy.next();
    //this._onDestroy.complete();
  }

  ngOnInit(): void {
    // Initialize the form, create it, and fetch counterparties
    this.initializeForm();
    this.fetchCounterparties();

    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);

    // Fetch the covenant data by ID
    this.covenantService.getCovenantById(covenantId).subscribe((covenant) => {
      if (covenant) {
        this.covenant = covenant;
        // Patch the form with the covenant data
        this.updateForm.patchValue({
          nameCovenant: covenant.nameCovenant,
          categoryCovenant: covenant.categoryCovenant,
          descriptionCovenant: covenant.descriptionCovenant,
          typeCovenant: covenant.typeCovenant,
          periodTypeCovenant: covenant.periodTypeCovenant,
          statementSourceCovenant: covenant.statementSourceCovenant,
          linkedLineItem: covenant.linkedLineItem,
          idCounterparty: covenant.idCounterparty,
        });
        // Update the linkedLineItems based on the selected type
        this.linkedLineItems = this.updateLinkedLineItems(
          covenant.typeCovenant
        );
      }
    });

    // Subscribe to changes in the "Type Covenant" dropdown
    this.updateForm.get('typeCovenant')?.valueChanges.subscribe((value) => {
      // Update the linkedLineItems based on the selected type
      this.linkedLineItems = this.updateLinkedLineItems(value);
    });
  }

  public goToCondition() {
    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.router.navigate(['/condition/list/', covenantId]);
  }

  get form() {
    return this.updateForm.controls;
  }

  private initializeForm(): void {
    // Initialize form fields
    this.updateForm = this.formBuilder.group({
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
    // Fetch counterparties from the service
    this.counterpartyService
      .getAllCounterparties()
      .subscribe((counterparties) => {
        console.log(counterparties);
        this.counterparties = counterparties;
      });
  }

  public update() {
    // Update the covenant object with form values
    this.covenant = {
      ...this.covenant,
      ...this.updateForm.value,
    };
    console.log(this.covenant);

    // Call the updateCovenant method from the service
    this.covenantService.updateCovenant(this.covenant).subscribe((response) => {
      console.log(response);
      if (response) {
        this._snackBar.open('Updated with Success', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
        // Redirect to the covenant detail page or any other appropriate route
        this.router.navigate(['/covenant', this.covenant.idCovenant]);
      } else {
        this._snackBar.open('Covenant Updated Successfully', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
      }
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
