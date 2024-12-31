import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerSearchComponent } from './biller-search.component';

describe('BillerSearchComponent', () => {
  let component: BillerSearchComponent;
  let fixture: ComponentFixture<BillerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
