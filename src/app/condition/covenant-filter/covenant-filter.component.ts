import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, of } from 'rxjs';
import { Covenant } from 'src/core/entities/covenant.model';
import { CovenantService } from 'src/core/services/covenant.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-covenant-filter',
  templateUrl: './covenant-filter.component.html',
  styleUrls: ['./covenant-filter.component.css'],
})
export class CovenantFilterComponent implements OnInit {
  selectForm!: FormGroup;
  covenantFilter: FormControl = new FormControl('');
  filteredCovenants!: Observable<Covenant[]>;
  selectedCovenantName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private covenantService: CovenantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      idCovenant: [null],
    });

    // Set up the covenant filter
    this.covenantFilter.valueChanges
      .pipe(debounceTime(300))
      .subscribe((filterValue) => {
        if (filterValue) {
          this.filteredCovenants =
            this.covenantService.filterCovenantsByName(filterValue);
        } else {
          this.filteredCovenants = of([]);
        }
      });
  }

  onCovenantSelected(idCovenant: number): void {
    this.filteredCovenants
      .pipe(
        map((covenants) =>
          covenants.find((covenant) => covenant.idCovenant === idCovenant)
        )
      )
      .subscribe((selectedCovenant) => {
        if (selectedCovenant) {
          this.selectedCovenantName = selectedCovenant.nameCovenant;
          this.selectForm.patchValue({ idCovenant: idCovenant });
          this.router.navigate(['/condition/list', idCovenant]);
        }
      });
  }
}
