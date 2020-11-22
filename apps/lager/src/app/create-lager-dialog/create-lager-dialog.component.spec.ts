import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLagerDialogComponent } from './create-lager-dialog.component';

describe('CreateLagerDialogComponent', () => {
  let component: CreateLagerDialogComponent;
  let fixture: ComponentFixture<CreateLagerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLagerDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
