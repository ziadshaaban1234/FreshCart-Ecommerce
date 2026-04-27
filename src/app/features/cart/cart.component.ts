import { Component, computed, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ICart } from '../../core/models/ICart/icart.interface';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/services/auth/auth.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { IGuestCartItem } from '../../core/models/IGuestCartItem/iguest-cart-item.interface';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID);


  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    if (this.authService.isLoggedInUser()) {
      this.getLoggedUserCart();
    }
    else {
      this.getGuestCart();
    }
  }


  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }
  getGuestCart() {
    if (isPlatformBrowser(this.platformId)) {
      let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      this.cartService.numberOfCartItems.set(guestCart.length);
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
    }
  }

  //========================
  ///Delete || Clear
  showDeleteItemModal: WritableSignal<boolean> = signal(false);
  showClearCartModal: WritableSignal<boolean> = signal(false);
  selectedItemID: WritableSignal<any> = signal('');
  selectedItemTitle: WritableSignal<string> = signal('');
  clearCart() {
    if (this.authService.isLoggedInUser()) {
      this.cartService.ClearUserCart().subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === "success") {
            this.cartDetails.set({} as ICart);//to refresh cart //empty object
            //To show cart items count in nav bar
            this.cartService.numberOfCartItems.set(0);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.cartDetails.set({} as ICart);//to refresh cart //empty object
      //To show cart items count in nav bar
      this.cartService.numberOfCartItems.set(0);
      localStorage.setItem('guestCart', JSON.stringify([]));
    }
  }


  deleteSpecificItem() {

    if (this.authService.isLoggedInUser()) {
      this.cartService.removeSpecificCartItem(this.selectedItemID()).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === "success") {
            this.cartDetails.set(res);//to refresh cart
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
      this.deleteItemFromGuestCart();
    }
    this.showDeleteItemModal.set(false);
  }

  deleteItemFromGuestCart(itemId?: any) {
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    guestCart = guestCart.filter(
      (item: any) => item.product.id !== (itemId ?? this.selectedItemID())
    );
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    this.getGuestCart();//To refresh cart

  }

  productCount: WritableSignal<number> = signal(1);
  updateItemQuantity(id: any, newCount: any) {
    if (this.authService.isLoggedInUser()) {
      this.cartService.updateCartProductQuantity(id, newCount).subscribe({
        next: (res) => {
          console.log(res);
          this.productCount.set(newCount);
          if (res.status === "success") {
            this.cartDetails.set(res);//to refresh cart
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
      if (newCount <= 0) {
        this.deleteItemFromGuestCart(id);
        return
      }
      let guestCart: IGuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
      let existingProduct = guestCart.find(
        item => item.product.id === id
      );
      if (existingProduct) {
        existingProduct.count = newCount;
        if (newCount > existingProduct.product.quantity) return;
        if (newCount < 0) return;
      }
      else { return }



      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      this.getGuestCart();
      this.cartService.numberOfCartItems.set(guestCart.length);
    }
  }

  openDeleteItemModal(item: any) {
    this.selectedItemID.set(item.product.id);
    this.selectedItemTitle.set(item.product.title);
    this.showDeleteItemModal.set(true);
  }
  ////FREE  SHIPPING
  totalPrice = computed(() => this.cartDetails()?.data?.totalCartPrice ?? 0);

  remainingForFreeShipping = computed(() =>
    Math.max(0, 500 - this.totalPrice())
  );

  progressWidth = computed(() =>
    Math.min(100, (this.totalPrice() / 500) * 100)
  );

  hasFreeShipping = computed(() => this.totalPrice() >= 500);
}
