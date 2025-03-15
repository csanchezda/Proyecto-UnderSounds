import { Routes } from '@angular/router';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { BasicLayoutComponent } from './basic-layout/basic-layout.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';

// EJEMPLOS DE PÁGINAS Y DE COMO TIENE QUE IR LA ESTRUCTURA
// PÁGINAS con el layout completo como main-menu
//import { AnotherPageComponent } from './pages/another-page/another-page.component';
// PÁGINAS que solo tiene header y footer
import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
// PÁGINAS sin layout
//import { LoginComponent } from './pages/login/login.component';

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
  {
    path: 'faq',
    component: BasicLayoutComponent, // También usa el basic-layout
    children: [
      { path: '', component: FaqComponent }
    ]
  },
  {
    path: 'privacy',
    component: BasicLayoutComponent, // También usa el basic-layout
    children: [
      { path: '', component: PrivacyComponent }
    ]
  },
  {
    path: 'terms',
    component: BasicLayoutComponent, // También usa el basic-layout
    children: [
      { path: '', component: TermsComponent }
    ]
  },
  //{ path: 'login', component: LoginComponent }, // Login NO usa ningún layout
  { path: '**', redirectTo: '' },
];
