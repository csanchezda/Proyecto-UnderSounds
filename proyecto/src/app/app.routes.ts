import { Routes } from '@angular/router';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { BasicLayoutComponent } from './basic-layout/basic-layout.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';

// EJEMPLOS DE PÁGINAS Y DE COMO TIENE QUE IR LA ESTRUCTURA
//import { AnotherPageComponent } from './pages/another-page/another-page.component';
import { AboutComponent } from './pages/about/about.component'; // Página que solo tiene header y footer
//import { LoginComponent } from './pages/login/login.component'; // Página sin layout

export const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent, // MenuLayout con header, subheader y footer
    children: [
      { path: '', component: MainMenuComponent }, // Vista predeterminada con todo
      //{ path: 'another-page', component: AnotherPageComponent }, // Página dentro del menú
    ],
  },
  {
    path: 'about',
    component: BasicLayoutComponent, // Usa el basic-layout que tiene solo header y footer
    children: [
      { path: '', component: AboutComponent }
    ]
  },
  //{ path: 'login', component: LoginComponent }, // Login NO usa ningún layout
  { path: '**', redirectTo: '' },
];
