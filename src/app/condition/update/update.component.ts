import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Covenant, LinkedLineItemEnum } from 'src/core/entities/covenant.model';
import { CovenantCondition } from 'src/core/entities/covenantCondition.model';
import { ConditionService } from 'src/core/services/condition.service';
import { CovenantService } from 'src/core/services/covenant.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit, OnDestroy {
  updateForm!: FormGroup;
  _onDestroy!: Subject<void>;
  condition!: CovenantCondition;
  covenant!: Covenant;
  selectedLineItem!: LinkedLineItemEnum;

  constructor(
    private conditionService: ConditionService,
    private covenantService: CovenantService,
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

    // Get the covenant ID from the route params
    const conditionId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.conditionService
      .getCovenantConditionById(conditionId)
      .subscribe((condition) => {
        if (condition) {
          this.condition = condition;
          const covenantId = +this.condition.idCovenant;
          // Fetch the covenant data by ID
          this.covenantService
            .getCovenantById(covenantId)
            .subscribe((covenant) => {
              this.covenant = covenant;
              this.selectedLineItem = this.covenant.linkedLineItem;
              console.log('linked line item : ', this.selectedLineItem);
            });
        }
      });

    // Fetch the condition data by ID
    this.conditionService
      .getCovenantConditionById(conditionId)
      .subscribe((condition) => {
        if (condition) {
          this.condition = condition;
          console.log(
            'FinancialData   :   ',
            condition.financialData.totalEquity
          );
          // Patch the form with the covenant data
          this.updateForm.patchValue({
            startDateCondition: condition.startDateCondition,
            endDateCondition: condition.endDateCondition,
            lowerLimitCondition: condition.lowerLimitCondition,
            upperLimitCondition: condition.upperLimitCondition,
            contractualFlagCondition: condition.contractualFlagCondition,
            exceptionFlagCondition: condition.exceptionFlagCondition,
            breachWeight: condition.breachWeight,
            // get financial data values
            financialData: condition.financialData,
          });
        }
      });
  }

  public goToCondition() {
    // Get the condition ID from the route params
    const conditionId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.conditionService
      .getCovenantConditionById(conditionId)
      .subscribe((condition) => {
        if (condition) {
          this.condition = condition;
          const covenantId = +this.condition.idCovenant;
          this.router.navigate(['/condition/list/', covenantId]);
        }
      });
  }

  get form() {
    return this.updateForm.controls;
  }

  private initializeForm(): void {
    // Initialize form fields
    this.updateForm = this.formBuilder.group({
      startDateCondition: ['', Validators.required],
      endDateCondition: ['', Validators.required],
      lowerLimitCondition: [0],
      upperLimitCondition: [0],
      contractualFlagCondition: [false],
      exceptionFlagCondition: [false],
      breachWeight: [0, Validators.required],
      financialData: this.formBuilder.group({
        netIncome: [0], // Initialize financial data fields with 0
        interest: [0],
        taxes: [0],
        totalEquity: [0],
        totalAssets: [0],
        operatingExpenses: [0],
        totalRevenues: [0],
        depreciation: [0],
        amortization: [0],
        currentAssets: [0],
        currentLiabilities: [0],
        grossProfit: [0],
        totalDebt: [0],
        totalDebtService: [0],
        interestExpense: [0],
        costOfGoodsSold: [0],
        averageInventory: [0],
      }),
    });
  }

  public update() {
    // Update the condition object with form values
    this.condition = {
      ...this.condition,
      ...this.updateForm.value,
    };
    console.log(this.condition);

    // Call the updateCovenantCondition method from the service
    this.conditionService
      .updateCovenantCondition(this.condition)
      .subscribe((response) => {
        console.log(response);
        if (response) {
          this._snackBar.open('Updated with Success', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        } else {
          this._snackBar.open('Condition Updated Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        }
      });
  }
}
