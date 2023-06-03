import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsListComponent } from './years-list.component';

describe('YearsListComponent', () => {
  let component: YearsListComponent;
  let fixture: ComponentFixture<YearsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearsListComponent]
    });
    fixture = TestBed.createComponent(YearsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});