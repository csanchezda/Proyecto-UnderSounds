import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualArticleAlbumComponent } from './individual-article-album.component';

describe('IndividualArticleAlbumComponent', () => {
  let component: IndividualArticleAlbumComponent;
  let fixture: ComponentFixture<IndividualArticleAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualArticleAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualArticleAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
