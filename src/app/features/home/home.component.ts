import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';

import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../core/models/ICategory/icategory.interface';
import { RouterLink } from "@angular/router";
import { register } from 'swiper/element/bundle';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MyJwtPayload } from '../../core/models/MyJwtPayload/my-jwt-payload.interface';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, CategoryCardComponent, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);
  private readonly platfromId = inject(PLATFORM_ID);
  productList: WritableSignal<IProduct[]> = signal([]);
  categoriesList: WritableSignal<ICategory[]> = signal([]);

  //Subscrition
  private productsSub: Subscription | null = null;
  private categoriesSub: Subscription | null = null;
  private wishlistSub: Subscription | null = null;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.getAllProducts();
    this.getAllCategories();

    if (this.authService.isLoggedInUser()) {
      this.getLoggedUserWishList();
      this.getUserID();
    }
    else {
      this.getGuestWishlist();
    }

    // register Swiper custom elements
    register();
  }


  getAllProducts() {
    this.productsSub = this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
        console.log(this.productList());

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getAllCategories() {
    this.categoriesSub = this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
        console.log(this.categoriesList());
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private readonly wishlistService = inject(WishlistService);
  wishListDetails: WritableSignal<IProduct[]> = signal([]);

  getLoggedUserWishList() {
    this.wishlistSub = this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishListDetails.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  getGuestWishlist() {
    if (isPlatformBrowser(this.platfromId)) {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      this.wishListDetails.set(guestWishlist);
      this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
    }
  }
  //===================


  getUserID() {
    if (!this.authService.userId()) {
      if (isPlatformBrowser(this.platfromId)) {
        const token = localStorage.getItem('eCommerceToken') || sessionStorage.getItem('eCommerceToken');
        if (token) {
          const decoded = jwtDecode<MyJwtPayload>(token); // Returns with the JwtPayload type
          this.authService.userId.set(decoded.id);
          this.authService.userName.set(decoded.name);
        }
      }
    }

  }



  ngOnDestroy() {
    this.productsSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
    this.wishlistSub?.unsubscribe();
  }

}
