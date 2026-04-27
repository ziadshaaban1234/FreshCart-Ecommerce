import { Component, computed, inject, input, InputSignal, OnInit, Signal, signal, WritableSignal, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID, OnDestroy, } from '@angular/core';
import { IProduct } from '../../../core/models/IProduct/iproduct.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products/products.service';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

import { register } from 'swiper/element/bundle';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IGuestCartItem } from '../../../core/models/IGuestCartItem/iguest-cart-item.interface';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  private addToCartSub: Subscription | null = null;
  private addToWishlistSub: Subscription | null = null;
  private deleteFromWishlistSub: Subscription | null = null

  productId: WritableSignal<string> = signal('');
  prodData: WritableSignal<IProduct> = signal({} as IProduct);

  quantity: WritableSignal<number> = signal(1);
  maxQuantity: Signal<number> = computed(() => this.prodData().quantity);

  totalPrice: Signal<number> = computed(() => this.prodData().price * this.quantity());

  increaseQuantity() {
    this.quantity.update(q => q < this.maxQuantity() ? q + 1 : q);
  }
  decreaseQuantity() {
    this.quantity.update(q => q > 1 ? q - 1 : q);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.getProductIDfromRoute();
    register();
  }


  getProductIDfromRoute() {
    this.activatedRoute.paramMap.subscribe((url) => {
      let id = url.get('id');
      if (id) {
        this.productId.set(id);
        this.getSpecificProduct();
      }
    })
  }


  getSpecificProduct() {
    this.productsService.getSpecificProduct(this.productId()).subscribe({
      next: (res) => {
        console.log(res);
        this.prodData.set(res.data);
        if (this.authService.isLoggedInUser() === true) {
          this.getLoggedUserWishList();
        }
        else {
          this.getGuestWishlist();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  addToCart() {
    if (this.authService.isLoggedInUser()) {
      this.addToCartSub = this.cartService.addProductToCart(this.productId()).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            console.log(res);
            if (this.quantity() > 1) {
              this.updateProductQuantity();
              this.toastrService.success(`${this.quantity()} of ${this.prodData().title} Added`, "Product Added")
            }
            else {
              this.toastrService.success(
                `${this.prodData().title} has been added to your cart`,
                "Product Added"
              );
            }
            //To show cart items count in nav bar
            this.cartService.numberOfCartItems.set(res.numOfCartItems);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else { this.addToGuestCart() }
  }

  addToGuestCart() {
    let guestCart: IGuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');

    let existingProduct = guestCart.find(
      item => item.product.id === this.prodData().id
    );
    if (existingProduct) { //refresnce not a new copy
      existingProduct.count++;
    } else {
      guestCart.push({
        product: this.prodData(),
        count: this.quantity()
      });
    }
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    this.cartService.numberOfCartItems.set(guestCart.length);
    this.toastrService.success(
      `${this.prodData().title} saved locally`,
      "Saved"
    );
  }
  //===========
  updateProductQuantity() {
    this.cartService.updateCartProductQuantity(this.productId(), this.quantity()).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }



  addToWishlist() {
    if (this.authService.isLoggedInUser()) {
      this.addToWishlistSub = this.wishlistService.addProductToWishlist(this.productId()).subscribe({
        next: (res) => {
          console.log(res);
          this.inWishListFlag.set(true);
          this.toastrService.success(
            `${this.prodData().title} has been added to your wish list`,
            "Product Added"
          );
          this.wishlistService.numberOfWishListItems.set(res.data.length);
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(
            `Failed to Add ${this.prodData().title} to your wish list`,
            "Error"
          );
        }
      });
    }
    else {
      this.addToGuestWishlist();
    }
  }


  addToGuestWishlist() {
    let guestWishlist: IProduct[] =
      JSON.parse(localStorage.getItem('guestWishlist') || '[]');

    let exists = guestWishlist.some(
      item => item.id === this.prodData().id
    );

    if (!exists) {
      guestWishlist.push(this.prodData());

      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));

      this.toastrService.success(
        `${this.prodData().title} saved locally ❤️`,
        "Saved"
      );

      this.inWishListFlag.set(true);
      this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
    } else {
      this.toastrService.info(
        `${this.prodData().title} already in wishlist 😏`,
        "Already Added"
      );
    }
  }

  deleteItemFromWishlist() {
    if (this.authService.isLoggedInUser()) {
      this.deleteFromWishlistSub = this.wishlistService.removeProductFromWishlist(this.productId()).subscribe({
        next: (res) => {
          console.log(res);
          this.inWishListFlag.set(false);
          this.wishlistService.numberOfWishListItems.set(res.data.length);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');

      guestWishlist = guestWishlist.filter(
        (item: IProduct) => item.id !== this.prodData().id
      );

      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));

      this.inWishListFlag.set(false);
      this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
    }
  }


  wishListDetails: WritableSignal<IProduct[]> = signal([]);
  inWishListFlag: WritableSignal<boolean | null> = signal(null);
  getLoggedUserWishList() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishListDetails.set(res.data);
        //Check if in wish List
        this.inWishListFlag.set(this.wishListDetails()?.some(
          p => p.id === this.productId()
        ));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private readonly platformId = inject(PLATFORM_ID);
  getGuestWishlist() {
    if (isPlatformBrowser(this.platformId)) {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      this.wishListDetails.set(guestWishlist);
      this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
    }
  }


  ngOnDestroy(): void {
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
    this.deleteFromWishlistSub?.unsubscribe();
  }
}
