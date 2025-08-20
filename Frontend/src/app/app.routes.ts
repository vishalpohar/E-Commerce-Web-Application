import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SearchComponent } from './search/search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { PreorderComponent } from './preorder/preorder.component';
import { AddressComponent } from './address/address.component';
import { MyordersComponent } from './myorders/myorders.component';
import { authGuard } from './auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'search/:keywords',
    component: SearchComponent,
  },
  {
    path: 'wishlist/:id',
    component: WishlistComponent,
    canActivate: [authGuard],
  },
  { path: 'cart/:id', component: CartComponent, canActivate: [authGuard] },
  {
    path: 'preorder/:productId/:userId',
    component: PreorderComponent,
    canActivate: [authGuard],
  },
  { path: 'address', component: AddressComponent, canActivate: [authGuard] },
  {
    path: 'myorders/:userId',
    component: MyordersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'userProfile/:userId',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
];
