import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualArticleSongComponent } from './individual-article-song.component';

describe('IndividualArticleSongComponent', () => {
  let component: IndividualArticleSongComponent;
  let fixture: ComponentFixture<IndividualArticleSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualArticleSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualArticleSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
