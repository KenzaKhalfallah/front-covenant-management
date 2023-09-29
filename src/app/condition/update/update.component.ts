import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private _snackBar: MatSnackBar,
    private toastr: ToastrService
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
          console.log('Condition before update   :   ', condition);
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

  // Add this private method to increment the date
  private incrementDateByOneDay(date: Date): Date {
    const incrementedDate = new Date(date);
    incrementedDate.setDate(incrementedDate.getDate() + 1);
    return incrementedDate;
  }

  public update() {
    // Store the initial start and end dates
    const initialStartDate = this.condition.startDateCondition;
    const initialEndDate = this.condition.endDateCondition;

    // Update the condition object with form values
    this.condition = {
      ...this.condition,
      ...this.updateForm.value,
    };
    console.log(this.condition);

    // Check if the start date is after the end date
    if (this.condition.startDateCondition > this.condition.endDateCondition) {
      // Display an error using toastr
      this.toastr.error('Start date cannot be after the End date.', 'Error');
      return; // Stop further processing
    } else {
      // Check if statements don't fall within modified covenant date range
      const currentDate = new Date(); // Get the current date
      if (
        this.condition.startDateCondition > currentDate ||
        currentDate > this.condition.endDateCondition
      ) {
        // Display a warning using toastr
        this.toastr.warning(
          'Warning: The current date falls within the modified covenant date range. Covenant results may need to be re-generated.',
          'Warning'
        );
      }
    }

    // Check if the start date or end date has changed
    const startDateChanged =
      this.condition.startDateCondition !== initialStartDate;
    const endDateChanged = this.condition.endDateCondition !== initialEndDate;
    if (startDateChanged) {
      // At least one of the dates has changed, so increment them
      this.condition.startDateCondition = this.incrementDateByOneDay(
        this.condition.startDateCondition
      );
    }
    if (endDateChanged) {
      this.condition.endDateCondition = this.incrementDateByOneDay(
        this.condition.endDateCondition
      );
    }

    // Call the updateCovenantCondition method from the service
    this.conditionService
      .updateCovenantCondition(this.condition)
      .subscribe((response) => {
        console.log('RESPONSE   :', response);
        this._snackBar.open('Condition Updated Successfully', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
        });
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
}
