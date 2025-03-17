import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterArtistComponent } from './register-artist.component';

describe('RegisterArtistComponent', () => {
  let component: RegisterArtistComponent;
  let fixture: ComponentFixture<RegisterArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterArtistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
