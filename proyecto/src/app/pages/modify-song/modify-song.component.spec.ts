import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySongComponent } from './modify-song.component';

describe('ModifySongComponent', () => {
  let component: ModifySongComponent;
  let fixture: ComponentFixture<ModifySongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifySongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifySongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
