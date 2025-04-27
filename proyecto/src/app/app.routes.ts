import { Routes } from '@angular/router';

// IMPORTAR LOS LAYOUTS
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { BasicLayoutComponent } from './basic-layout/basic-layout.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
// EJEMPLOS DE PÁGINAS Y DE COMO TIENE QUE IR LA ESTRUCTURA
// PÁGINAS con el layout completo como main-menu
import { ViewDiscographyComponent } from './pages/view-discography/view-discography.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { SongsComponent } from './pages/songs/songs.component';
import { UploadSongComponent } from './pages/upload-song/upload-song.component';
import { ModifySongComponent } from './pages/modify-song/modify-song.component';
import { ShopComponent } from './pages/shop/shop.component';
import { AlbumsComponent } from './pages/albums/albums.component';
import { IndividualArtistComponent } from './pages/individual-artist/individual-artist.component';
import { IndividualAlbumComponent } from './pages/individual-album/individual-album.component';
import { IndividualArticleSongComponent } from './pages/individual-article-song/individual-article-song.component';
import { IndividualArticleAlbumComponent } from './pages/individual-article-album/individual-article-album.component';
import { IndividualSongComponent } from './pages/individual-song/individual-song.component';
import { CreateAlbumComponent } from './pages/create-album/create-album.component';
import { ModifyAlbumComponent } from './pages/modify-album/modify-album.component';
// PÁGINAS que solo tiene header y footer
import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { SettingsComponent } from './pages/settings/settings.component';
// PÁGINAS sin layout
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterFanComponent } from './pages/register-fan/register-fan.component';
import { RegisterArtistComponent } from './pages/register-artist/register-artist.component';
import { ConfirmNewPasswordComponent } from './pages/confirm-new-password/confirm-new-password.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent, // MenuLayout con header, subheader y footer
    children: [
      { path: '', component: MainMenuComponent}, // Página con el layout completo
      { path: 'songs', component: SongsComponent}, // Página con el layout completo
      { path: 'individual-song/:id', component: IndividualSongComponent}, // Página con el layout completo
      { path: 'albums', component: AlbumsComponent }, // Página con el layout completo
      { path: 'album/:id', component: IndividualAlbumComponent }, // Página con el layout completo
      { path: 'artists', component: ArtistsComponent }, // Página con el layout completo
      { path: 'artist/:artistName', component: IndividualArtistComponent }, // Página con el layout completo
      { path: 'shop/songs/:id', component: IndividualArticleSongComponent }, // Página con el layout completo
      { path: 'shop/albums/:id', component: IndividualArticleAlbumComponent }, // Página con el layout completo
      { path: 'view-discography', component: ViewDiscographyComponent }, // Página con el layout completo
      { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
      { path: 'upload-song', component: UploadSongComponent, canActivate: [AuthGuard] },
      { path: 'modify-song', component: ModifySongComponent, canActivate: [AuthGuard] },
      { path: 'create-album', component: CreateAlbumComponent, canActivate: [AuthGuard] },
      { path: 'modify-album', component: ModifyAlbumComponent, canActivate: [AuthGuard] },
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
  {
    path: 'cart',
    component: BasicLayoutComponent, // También usa el basic-layout
    children: [
      { path: '', component: CartComponent }
    ]
  },
  {
    path: 'settings',
    component: BasicLayoutComponent, // También usa el basic-layout
    children: [
      { path: '', component: SettingsComponent }
    ]
  },
  { path: 'login', component: LoginComponent }, // Login sin layout y con box-container
  { path: 'confirm-new-password', component: ConfirmNewPasswordComponent, canActivate: [AuthGuard] }, // ConfirmNewPassword sin layout y con box-container
  { path: 'register', component: RegisterComponent }, // Register sin layout y con box-container
  { path: 'forgot-password', component: ForgotPasswordComponent }, // ForgotPassword sin layout y con box-container
  { path: 'register-fan', component: RegisterFanComponent }, // RegisterFan sin layout y con box-container
  { path: 'register-artist', component: RegisterArtistComponent }, // RegisterArtist sin layout y con box-container
  { path: '**', redirectTo: '' }
];