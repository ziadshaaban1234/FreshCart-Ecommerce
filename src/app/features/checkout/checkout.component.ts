import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../core/models/ICart/icart.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../core/services/orders/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  cartId = computed(() => this.cartDetails()?.cartId ?? '');

  private readonly fb = inject(FormBuilder);
  checkoutForm!: FormGroup;

  ngOnInit(): void {
    this.initCheckoutForm();
    this.getLoggedUserCart();
  }
  initCheckoutForm() {
    this.checkoutForm = this.fb.group({
      details: [null, [Validators.required, Validators.minLength(10)]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: [null, [Validators.required, Validators.minLength(3)]],
    });
    //OR
    //  this.checkoutForm = this.fb.group({
    //     shippingAddress: this.fb.group({
    //       details: [null, [Validators.required]],
    //       phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    //       city: [null, [Validators.required]],
    //     })
    //   });

  }
  private readonly ordersService = inject(OrdersService);
  checkoutSession() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    console.log(this.checkoutForm.value);
    //  prepeare data in the same way as api needs
    const payload = {
      shippingAddress: this.checkoutForm.value
    }
    this.ordersService.checkoutSession(this.cartId(), payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.numberOfCartItems.set(0);
          window.open(res.session.url, '_self');//_self to open in the same tab
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  private readonly router = inject(Router)
  payCash() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    console.log(this.checkoutForm.value);
    //  prepeare data in the same way as api needs
    const payload = {
      shippingAddress: this.checkoutForm.value
    }
    this.ordersService.createCashOrder(this.cartId(), payload).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.cartService.numberOfCartItems.set(0);
          this.router.navigate(['/allorders']);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  //HELPER Mehtods
  payWithVisaFlag: WritableSignal<boolean> = signal(false);
  private readonly cartService = inject(CartService);
  cartDetails: WritableSignal<ICart> = signal({} as ICart);

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

  totalPrice = computed(() => this.cartDetails()?.data?.totalCartPrice ?? 0);
  hasFreeShipping = computed(() => this.totalPrice() >= 500);
  shippingCost: WritableSignal<number> = signal(50);
  totalPriceWithShipping = computed(() => {
    return this.hasFreeShipping()
      ? this.totalPrice()
      : this.totalPrice() + this.shippingCost();
  });


}
