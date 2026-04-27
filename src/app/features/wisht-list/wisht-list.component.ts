import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { RouterLink } from "@angular/router";
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../core/models/ICart/icart.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { IGuestCartItem } from '../../core/models/IGuestCartItem/iguest-cart-item.interface';

@Component({
  selector: 'app-wisht-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './wisht-list.component.html',
  styleUrl: './wisht-list.component.css',
})
export class WishtListComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  ngOnInit(): void {
    if (this.authService.isLoggedInUser()) {
      this.getLoggedUsertWishlist();
      this.getLoggedUserCart();
    } else {
      if (isPlatformBrowser(this.platformId)) {
        this.getGuestWishlist();
        this.getGuestCart();
      }
    }
  }

  wishProductsList: WritableSignal<IProduct[]> = signal([]);
  getLoggedUsertWishlist() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishProductsList.set(res.data);
        console.log(this.wishProductsList());
        this.wishlistService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      }

    });
  }
  getGuestWishlist() {
    let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    this.wishProductsList.set(guestWishlist);
    this.wishlistService.numberOfWishListItems.set(guestWishlist.length);
  }
  //===================
  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  private readonly cartService = inject(CartService);
  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res);
        this.cartService.numberOfCartItems.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }


  getGuestCart() {
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

    this.cartDetails.set({
      status: "success",
      numOfCartItems: guestCart.length,
      cartId: "guest",
      data: {
        _id: "guest",
        cartOwner: "guest",
        products: guestCart.map((item: any) => ({
          count: item.count,
          _id: item.product._id,
          product: item.product,
          price: item.product.price
        })),
        createdAt: "",
        updatedAt: "",
        __v: 0,
        totalCartPrice: guestCart.reduce(
          (total: number, item: any) =>
            total + item.product.price * item.count,
          0
        )
      }
    });
    this.cartService.numberOfCartItems.set(guestCart.length);

  }

  checkIfInCart(productId: any) {
    return this.cartDetails()?.data?.products?.find(
      p => p.product.id === productId
    );
  }



  deleteItemFromWishlist(productId: any) {
    //User Mood
    if (this.authService.isLoggedInUser() === true) {
      this.wishlistService.removeProductFromWishlist(productId).subscribe({
        next: (res) => {
          console.log(res);
          this.getLoggedUsertWishlist();
          this.wishlistService.numberOfWishListItems.set(res.data.length);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    //Guest Mood
    else {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');

      guestWishlist = guestWishlist.filter(
        (item: IProduct) => item.id !== productId
      );

      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
      this.getGuestWishlist();
    }
  }


  addToCart(product: IProduct) {
    if (this.authService.isLoggedInUser() === true) {

      this.cartService.addProductToCart(product.id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            console.log(res);
            //To show cart items count in nav bar
            this.cartService.numberOfCartItems.set(res.numOfCartItems);
            this.getLoggedUserCart();

          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.addToGuestCart(product);
    }
  }

  addToGuestCart(product: IProduct) {
    let guestCart: IGuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');

    let existingProduct = guestCart.find(
      item => item.product.id === product._id
    );
    if (existingProduct) { //refresnce not a new copy
      existingProduct.count++;
    } else {
      guestCart.push({
        product: product,
        count: 1
      });
    }
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    this.getGuestCart();


  }
}
