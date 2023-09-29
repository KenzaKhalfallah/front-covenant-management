import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-covenant-templates',
  templateUrl: './covenant-templates.component.html',
  styleUrls: ['./covenant-templates.component.css'],
})
export class CovenantTemplatesComponent implements OnInit {
  covenantTemplates: any[] = [
    {
      id: 1,
      name: 'Loan-to-Value Ratio Covenant',
      category: 'Financial',
      description:
        'This covenant monitors the Loan-to-Value (LTV) ratio of the counterparty.',
    },
    {
      id: 2,
      name: 'Interest Coverage Ratio Covenant',
      category: 'Financial',
      description:
        'This covenant monitors the Interest Coverage Ratio (ICR) of the counterparty.',
    },
    {
      id: 3,
      name: 'Current Ratio Covenant',
      category: 'Financial',
      description:
        'This covenant monitors the Current Ratio of the counterparty.',
    },
    {
      id: 4,
      name: 'Inventory Turnover Covenant',
      category: 'Financial',
      description:
        'This covenant monitors the Inventory Turnover of the counterparty.',
    },
  ];

  selectedTemplate: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectTemplate(template: any) {
    this.router.navigate(['/covenant/templateDetails', template.id]);
  }
}
