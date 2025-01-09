import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogagentComponent } from './dialogagent.component';

describe('DialogagentComponent', () => {
  let component: DialogagentComponent;
  let fixture: ComponentFixture<DialogagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogagentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
