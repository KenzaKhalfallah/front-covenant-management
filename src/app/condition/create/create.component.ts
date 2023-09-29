import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Covenant, LinkedLineItemEnum } from 'src/core/entities/covenant.model';
import { CovenantCondition } from 'src/core/entities/covenantCondition.model';
import { ConditionService } from 'src/core/services/condition.service';
import { CovenantService } from 'src/core/services/covenant.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  createForm!: FormGroup;
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
    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);

    // Initialize the form, create it and fetch counterparties
    this.initializeForm();

    // Fetch the covenant data by ID
    this.covenantService.getCovenantById(covenantId).subscribe((covenant) => {
      this.covenant = covenant;
      this.selectedLineItem = this.covenant.linkedLineItem;
      console.log('linked line item : ', this.selectedLineItem);
    });
  }

  public goToCondition() {
    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.router.navigate(['/condition/list/', covenantId]);
  }

  get form() {
    return this.createForm.controls;
  }

  private initializeForm(): void {
    // Initialize form fields
    this.createForm = this.formBuilder.group({
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

  public create() {
    this.condition = this.createForm.value;
    console.log(this.condition);

    // Check if the start date is after the end date
    if (this.condition.startDateCondition > this.condition.endDateCondition) {
      // Display a warning using toastr
      this.toastr.error('Start date cannot be after the End date.', 'Error');
      return; // Stop further processing
    }

    this.condition.startDateCondition = this.incrementDateByOneDay(
      this.condition.startDateCondition
    );
    this.condition.endDateCondition = this.incrementDateByOneDay(
      this.condition.endDateCondition
    );
    // Get the covenant ID from the route params
    const covenantId = +(this.route.snapshot.paramMap.get('id') ?? 0);

    this.conditionService
      .createCovenantCondition(covenantId, this.condition)
      .subscribe((response) => {
        if (response) {
          this._snackBar.open('Condition added Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        } else {
          this._snackBar.open('Dates are required !', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        }
      });

    // Clear the form fields and reset to default values
    this.initializeForm();
  }
}
