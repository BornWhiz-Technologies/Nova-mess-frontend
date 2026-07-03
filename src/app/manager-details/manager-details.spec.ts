import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDetails } from './manager-details';

describe('ManagerDetails', () => {
  let component: ManagerDetails;
  let fixture: ComponentFixture<ManagerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
