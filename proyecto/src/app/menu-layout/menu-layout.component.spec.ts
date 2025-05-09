import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuLayoutComponent } from './menu-layout.component';

describe('MenuLayoutComponent', () => {
  let component: MenuLayoutComponent;
  let fixture: ComponentFixture<MenuLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
