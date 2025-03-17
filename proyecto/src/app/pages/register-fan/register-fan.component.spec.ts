import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFanComponent } from './register-fan.component';

describe('RegisterFanComponent', () => {
  let component: RegisterFanComponent;
  let fixture: ComponentFixture<RegisterFanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
