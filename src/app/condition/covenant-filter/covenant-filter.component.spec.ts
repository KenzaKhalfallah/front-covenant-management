import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovenantFilterComponent } from './covenant-filter.component';

describe('CovenantFilterComponent', () => {
  let component: CovenantFilterComponent;
  let fixture: ComponentFixture<CovenantFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovenantFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovenantFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
