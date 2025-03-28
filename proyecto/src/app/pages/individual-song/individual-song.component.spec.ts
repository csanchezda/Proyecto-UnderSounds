import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSongComponent } from './individual-song.component';

describe('IndividualSongComponent', () => {
  let component: IndividualSongComponent;
  let fixture: ComponentFixture<IndividualSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
