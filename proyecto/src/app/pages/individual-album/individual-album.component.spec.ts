import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAlbumComponent } from './individual-album.component';

describe('IndividualAlbumComponent', () => {
  let component: IndividualAlbumComponent;
  let fixture: ComponentFixture<IndividualAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
