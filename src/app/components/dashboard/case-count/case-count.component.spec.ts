import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCountComponent } from './case-count.component';

describe('CaseCountComponent', () => {
  let component: CaseCountComponent;
  let fixture: ComponentFixture<CaseCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
