import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterParty } from 'src/core/entities/counterparty.model';
import {
  CategoryCovenant,
  Covenant,
  LinkedLineItemEnum,
  PeriodTypeCovenant,
  StatementSourceCovenant,
  TypeCovenant,
} from 'src/core/entities/covenant.model';
import { CounterpartyService } from 'src/core/services/counterparty.service';
import { CovenantService } from 'src/core/services/covenant.service';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css'],
})
export class TemplateDetailsComponent implements OnInit {
  covenantTemplate!: Covenant;
  selectedCounterparty: any;
  counterparties!: Array<CounterParty>;

  constructor(
    private covenantService: CovenantService,
    private counterpartyService: CounterpartyService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchCounterparties();
    // Get the 'id' parameter from the URL to identify the selected covenant template
    const templateId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.covenantTemplate = this.getCovenantTemplateById(templateId);
  }

  fetchCounterparties(): void {
    this.counterpartyService
      .getAllCounterparties()
      .subscribe((counterparties) => {
        this.counterparties = counterparties;
      });
  }

  getCovenantTemplateById(templateId: number): any {
    if (templateId === 1) {
      return {
        nameCovenant: 'Loan-to-Value Ratio Covenant',
        categoryCovenant: CategoryCovenant.FINANCIAL,
        descriptionCovenant:
          'This template represents a Loan-to-Value Ratio Covenant. It falls under the "Financial" category, is of the "Negative" type, and is applicable on an "Annual" basis using financial data from the "Company" statement source. The covenant condition requires the Total Debt to be less than or equal to 70% of some relevant financial metric (you would need to specify how Total Debt is calculated in your system). If this condition is breached, it s considered a major issue.',
        typeCovenant: TypeCovenant.NEGATIVE,
        periodTypeCovenant: PeriodTypeCovenant.ANNUAL,
        statementSourceCovenant: StatementSourceCovenant.COMPANY,
        linkedLineItem: LinkedLineItemEnum.DebtToEquityRatio,
      };
    } else if (templateId === 2) {
      return {
        nameCovenant: 'Interest Coverage Ratio Covenant',
        categoryCovenant: CategoryCovenant.FINANCIAL,
        descriptionCovenant:
          'This template represents an Interest Coverage Ratio Covenant. It falls under the "Financial" category, is of the "Affirmative" type, and is applicable on an "Annual" basis using financial data from the "Consolidation" statement source. The covenant condition requires the Interest Coverage Ratio to be at least 2.5 or higher. If this condition is breached, it s considered a major issue.',
        typeCovenant: TypeCovenant.AFFIRMATIVE,
        periodTypeCovenant: PeriodTypeCovenant.ANNUAL,
        statementSourceCovenant: StatementSourceCovenant.CONSOLIDATION,
        linkedLineItem: LinkedLineItemEnum.OperatingCashFlow,
      };
    } else if (templateId === 3) {
      return {
        nameCovenant: 'Current Ratio Covenant',
        categoryCovenant: CategoryCovenant.FINANCIAL,
        descriptionCovenant:
          'This template represents a Current Ratio Covenant. It falls under the "Financial" category, is of the "Affirmative" type, and is applicable on an "Annual" basis using financial data from the "Company" statement source. The covenant condition requires the Current Ratio to be at least 1.5 or higher. If this condition is breached, it s considered a moderate issue.',
        typeCovenant: TypeCovenant.AFFIRMATIVE,
        periodTypeCovenant: PeriodTypeCovenant.ANNUAL,
        statementSourceCovenant: StatementSourceCovenant.COMPANY,
        linkedLineItem: LinkedLineItemEnum.CurrentRatio,
      };
    } else if (templateId === 4) {
      return {
        nameCovenant: 'Inventory Turnover Covenant',
        categoryCovenant: CategoryCovenant.FINANCIAL,
        descriptionCovenant:
          'This template represents an Inventory Turnover Covenant. It falls under the "Financial" category, is of the "Negative" type, and is applicable on an "Annual" basis using financial data from the "Company" statement source. The covenant condition requires the Inventory Turnover to be at least 5 times per year. If this condition is breached, it s considered a minor issue.',
        typeCovenant: TypeCovenant.NEGATIVE,
        periodTypeCovenant: PeriodTypeCovenant.ANNUAL,
        statementSourceCovenant: StatementSourceCovenant.COMPANY,
        linkedLineItem: LinkedLineItemEnum.InventoryTurnover,
      };
    }
  }

  public saveCovenant() {
    this.covenantTemplate.idCounterparty = this.selectedCounterparty;
    console.log(this.covenantTemplate);
    this.covenantService
      .createCovenant(this.covenantTemplate)
      .subscribe((response) => {
        if (response) {
          this._snackBar.open('Covenant Created Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
          this.router.navigate(['/covenant/list']);
        } else {
          this._snackBar.open('Counterparty is required !', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        }
      });
  }
}
