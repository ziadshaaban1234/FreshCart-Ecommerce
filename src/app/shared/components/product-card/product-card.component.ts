import { AuthService } from './../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Component, inject, input, Input, InputSignal, OnChanges, OnDestroy, PLATFORM_ID, Signal, signal, WritableSignal } from '@angular/core';
import { IProduct } from '../../../core/models/IProduct/iproduct.interface';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { IGuestCartItem } from '../../../core/models/IGuestCartItem/iguest-cart-item.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnChanges, OnDestroy {
  //Old way
  // @Input({ required: true }) product!: IProduct;
  //using Signals
  product: InputSignal<IProduct> = input.required<IProduct>();
  wishListDetails: InputSignal<IProduct[]> = input.required<IProduct[]>();

  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly authService = inject(AuthService);
  private addToCartSub: Subscription | null = null;
  private addToWishlistSub: Subscription | null = null;
  private deleteFromWishlistSub: Subscription | null = null
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.checkIfInWishList();
  }

  addToCart() {
    if (this.authService.isLoggedInUser() === true) {

      this.addToCartSub = this.cartService.addProductToCart(this.product().id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            console.log(res);
            //Show Success Message
            this.toastrService.success(
              `${this.product().title} has been added to your cart`,
              "Product Added"
            );
            //To show cart items count in nav bar
            this.cartService.numberOfCartItems.set(res.numOfCartItems);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.addToGuestCart();
    }
  }
  addToGuestCart() {
    let guestCart: IGuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');

    let existingProduct = guestCart.find(
      item => item.product.id === this.product().id
    );
    if (existingProduct) { //refresnce not a new copy
      existingProduct.count++;
    } else {
      guestCart.push({
        product: this.product(),
        count: 1
      });
    }
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    this.cartService.numberOfCartItems.set(guestCart.length);
    this.toastrService.success(
      `${this.product().title} saved locally`,
      "Saved"
    );
  }



  private readonly wishlistService = inject(WishlistService);
  addToWishlist() {
    if (this.authService.isLoggedInUser() === true) {
      this.addToWishlistSub = this.wishlistService.addProductToWishlist(this.product().id).subscribe({
        next: (res) => {
          console.log(res);
          this.toastrService.success(
            `${this.product().title} has been added to your wish list`,
            "Product Added"
          );
          this.inWishListFlag.set(true);
          this.wishlistService.numberOfWishListItems.set(res.data.length);
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(
            `Failed to Add ${this.product().title} to your wish list`,
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
      item => item.id === this.product().id
    );

    if (!exists) {
      guestWishlist.push(this.product());

      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));

      this.toastrService.success(
        `${this.product().title} saved locally ❤️`,
        "Saved"
      );

      this.inWishListFlag.set(true);
      this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
    } else {
      this.toastrService.info(
        `${this.product().title} already in wishlist 😏`,
        "Already Added"
      );
    }
  }



  deleteItemFromWishlist() {
    if (this.authService.isLoggedInUser() === true) {
      this.deleteFromWishlistSub = this.wishlistService.removeProductFromWishlist(this.product().id).subscribe({
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
    // guest user
    else {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');

      guestWishlist = guestWishlist.filter(
        (item: IProduct) => item.id !== this.product().id
      );

      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));

      this.inWishListFlag.set(false);
      this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
    }
  }


  inWishListFlag: WritableSignal<boolean> = signal(false);
  private readonly platformId = inject(PLATFORM_ID);

  checkIfInWishList() {
    if (this.authService.isLoggedInUser()) {
      // logged user
      this.inWishListFlag.set(
        this.wishListDetails()?.some(
          p => p.id === this.product().id
        ) ?? false
      );
    } else {
      // guest user
      if (isPlatformBrowser(this.platformId)) {
        let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');

        this.inWishListFlag.set(
          guestWishlist.some(
            (item: any) => item.id === this.product().id
          )
        );
      }
    }
  }


  ngOnDestroy(): void {
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
    this.deleteFromWishlistSub?.unsubscribe();
  }
}
