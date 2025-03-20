import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscographyComponent } from './view-discography.component';

describe('ViewDiscographyComponent', () => {
  let component: ViewDiscographyComponent;
  let fixture: ComponentFixture<ViewDiscographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDiscographyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDiscographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
