import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAlbumComponent } from './modify-album.component';

describe('ModifyAlbumComponent', () => {
  let component: ModifyAlbumComponent;
  let fixture: ComponentFixture<ModifyAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
