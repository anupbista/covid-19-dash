import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyUpdatesComponent } from './weekly-updates.component';

describe('WeeklyUpdatesComponent', () => {
  let component: WeeklyUpdatesComponent;
  let fixture: ComponentFixture<WeeklyUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
