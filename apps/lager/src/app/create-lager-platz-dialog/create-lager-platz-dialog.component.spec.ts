import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLagerPlatzDialogComponent } from './create-lager-platz-dialog.component';

describe('CreateLagerPlatzDialogComponent', () => {
  let component: CreateLagerPlatzDialogComponent;
  let fixture: ComponentFixture<CreateLagerPlatzDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLagerPlatzDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLagerPlatzDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
