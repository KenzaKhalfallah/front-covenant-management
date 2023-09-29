import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovenantTemplatesComponent } from './covenant-templates.component';

describe('CovenantTemplatesComponent', () => {
  let component: CovenantTemplatesComponent;
  let fixture: ComponentFixture<CovenantTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovenantTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovenantTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
