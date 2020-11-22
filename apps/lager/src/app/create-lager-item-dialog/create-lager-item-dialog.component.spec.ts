import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLagerItemDialogComponent } from './create-lager-item-dialog.component';

describe('CreateLagerItemDialogComponent', () => {
  let component: CreateLagerItemDialogComponent;
  let fixture: ComponentFixture<CreateLagerItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLagerItemDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLagerItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
