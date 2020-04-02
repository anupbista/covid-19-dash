import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataloadingComponent } from './dataloading.component';

describe('DataloadingComponent', () => {
  let component: DataloadingComponent;
  let fixture: ComponentFixture<DataloadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataloadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
