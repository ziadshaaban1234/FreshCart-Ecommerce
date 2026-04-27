import { authGuard } from './core/guards/auth/auth-guard';

import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';

import { BrandsComponent } from './features/brands/brands.component';

import { CategoriesComponent } from './features/categories/categories.component';

import { SupportComponent } from './features/support/support.component';

import { WishtListComponent } from './features/wisht-list/wisht-list.component';

import { NotFoundComponent } from './features/not-found/not-found.component';

import { CartComponent } from './features/cart/cart.component';

import { ProductDetailsComponent } from './shared/components/product-details/product-details.component';

import { LoginComponent } from './core/auth/login/login.component';

import { RegisterComponent } from './core/auth/register/register.component';

import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';

import { CheckoutComponent } from './features/checkout/checkout.component';

import { AllOrdersComponent } from './features/all-orders/all-orders.component';

import { ShopComponent } from './features/shop/shop.component';

import { HelpQuestionsComponent } from './features/help-questions/help-questions.component';

import { BrandsFilterComponent } from './features/brands-filter/brands-filter.component';

import { CategoryFilterComponent } from './features/category-filter/category-filter.component';

import { ProfileComponent } from './features/profile/profile.component';

import { AddressesComponent } from './features/addresses/addresses.component';

import { SettingsComponent } from './features/settings/settings.component';

import { PrivacyPolicyComponent } from './features/pages/privacy-policy/privacy-policy.component';

import { TermsConditionsComponent } from './features/pages/terms-conditions/terms-conditions.component';



export const routes: Routes = [

    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, title: "Fresh Cart | Sign in" },

    { path: 'register', component: RegisterComponent, title: "Fresh Cart | Register" },

    { path: 'forgot-password', component: ForgotPasswordComponent, title: "Fresh Cart" },

    { path: 'home', component: HomeComponent, title: "Fresh Cart" },

    { path: 'shop', component: ShopComponent, title: "Fresh Cart" },

    { path: 'search', component: ShopComponent, title: "Fresh Cart | Search Results" },

    { path: 'product-details/:id', component: ProductDetailsComponent, title: "Fresh Cart" },

    { path: 'brands-filter/:id', component: BrandsFilterComponent, title: "Fresh Cart" },

    { path: 'category-filter/:id', component: CategoryFilterComponent, title: "Fresh Cart" },

    { path: 'brands', component: BrandsComponent, title: "Fresh Cart" },

    { path: 'categories', component: CategoriesComponent, title: "Fresh Cart" },

    { path: 'support', component: SupportComponent, title: "Fresh Cart" },

    { path: 'help', component: HelpQuestionsComponent, title: "Fresh Cart" },

    {

        path: 'profile', component: ProfileComponent, title: "Fresh Cart", children: [

            { path: '', redirectTo: 'addresses', pathMatch: 'full' },

            { path: 'addresses', component: AddressesComponent },

            { path: 'settings', component: SettingsComponent },

            { path: '**', component: NotFoundComponent, },

        ]

    },

    { path: 'wishlist', component: WishtListComponent, title: "Fresh Cart" },

    { path: 'checkout', component: CheckoutComponent, title: "Fresh Cart", canActivate: [authGuard] },

    { path: 'cart', component: CartComponent, title: "Fresh Cart" },

    { path: 'allorders', component: AllOrdersComponent, title: "Fresh Cart", canActivate: [authGuard] },

    { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy Policy' },

    { path: 'terms-conditions', component: TermsConditionsComponent, title: 'Terms of Service' },
    { path: 'deals', redirectTo: 'shop', pathMatch: 'full' },

    { path: '**', component: NotFoundComponent, title: "Fresh Cart| Not Found" },

];