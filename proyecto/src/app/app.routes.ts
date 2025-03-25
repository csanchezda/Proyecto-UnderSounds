import { Routes } from '@angular/router';

// IMPORTAR LOS LAYOUTS
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { BasicLayoutComponent } from './basic-layout/basic-layout.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';

// EJEMPLOS DE PÁGINAS Y DE COMO TIENE QUE IR LA ESTRUCTURA
// PÁGINAS con el layout completo como main-menu
import { ViewDiscographyComponent } from './pages/view-discography/view-discography.component';
import { CartComponent } from './pages/cart/cart.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { SongsComponent } from './pages/songs/songs.component';
import { AlbumsComponent } from './pages/albums/albums.component';
import { IndividualArtistComponent } from './pages/individual-artist/individual-artist.component';
import { IndividualAlbumComponent } from './pages/individual-album/individual-album.component';
import { IndividualArticleSongComponent } from './pages/individual-article-song/individual-article-song.component';
import { IndividualArticleAlbumComponent } from './pages/individual-article-album/individual-article-album.component';
// PÁGINAS que solo tiene header y footer
import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProfileComponent } from './pages/profile/profile.component';
// PÁGINAS sin layout
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterFanComponent } from './pages/register-fan/register-fan.component';
import { RegisterArtistComponent } from './pages/register-artist/register-artist.component';


export const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent, // MenuLayout con header, subheader y footer
    children: [
      { path: '', component: MainMenuComponent }, // Vista predeterminada con todo
      { path: 'songs', component: SongsComponent}, // Página con el layout completo
      { path: 'albums', component: AlbumsComponent }, // Página con el layout completo
      { path: 'album/:id', component: IndividualAlbumComponent }, // Ruta dinámica para el album
      { path: 'artists', component: ArtistsComponent }, // Página con el layout completo
      { path: 'artist/:artistName', component: IndividualArtistComponent }, // Ruta dinámica para el artista
      { path: 'shop/songs/:id', component: IndividualArticleSongComponent }, // Ruta dinámica para el indivial-article-song
      { path: 'shop/albums/:id', component: IndividualArticleAlbumComponent }, // Ruta dinámica para el indivial-article-album
      { path: 'view-discography', component: ViewDiscographyComponent }, // Página con el layout completo
      { path: 'cart', component: CartComponent}, // Página con el layout completo
      { path: 'settings', component:SettingsComponent} // Página con el layout completo
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
  {
    path: 'profile',
    component: BasicLayoutComponent, // También usa el basic-layout
    children: [
      { path: '', component: ProfileComponent }
    ]
  },
  { path: 'login', component: LoginComponent }, // Login sin layout y con box-container
  { path: 'register', component: RegisterComponent }, // Register sin layout y con box-container
  { path: 'forgot-password', component: ForgotPasswordComponent }, // ForgotPassword sin layout y con box-container
  { path: 'register-fan', component: RegisterFanComponent }, // RegisterFan sin layout y con box-container
  { path: 'register-artist', component: RegisterArtistComponent }, // RegisterArtist sin layout y con box-container
  { path: '**', redirectTo: '' }
];