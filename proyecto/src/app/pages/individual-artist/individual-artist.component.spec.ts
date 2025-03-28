import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualArtistComponent } from './individual-artist.component';

describe('IndividualArtistComponent', () => {
  let component: IndividualArtistComponent;
  let fixture: ComponentFixture<IndividualArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualArtistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
