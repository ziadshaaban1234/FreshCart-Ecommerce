import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { IGuestCartItem } from '../../models/IGuestCartItem/iguest-cart-item.interface';
import { IProduct } from '../../models/IProduct/iproduct.interface';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../../models/MyJwtPayload/my-jwt-payload.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  loginForm!: FormGroup;
  showPassword: WritableSignal<boolean> = signal(false);
  ngOnInit(): void {
    this.initLoginForm();
  }
  initLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      rememberMe: [false]
    })
  }
  errorMsg: WritableSignal<string> = signal('');
  successMsg: WritableSignal<string> = signal('');
  login() {
    console.log('Login function triggered!');
    if (this.loginForm.valid) {
      console.log('form: ', this.loginForm.value);
      // Destructure the form value:
      //       // - 'rememberMe' will be extracted as a separate variable
      //       // - '...payload' will contain the rest of the form fields without 'rememberMe'
      const { rememberMe, ...payload } = this.loginForm.value;
      console.log('payload: ', payload);
      this.authService.singIn(payload).subscribe({
        next: (res) => {

          if (res.message == "success") {
            // hide Error message
            this.errorMsg.set('');
            //2. show success message
            this.successMsg.set('Login Successfully');
            console.log(res);
            //1. Save token if remember me==true;
            if (rememberMe) {
              localStorage.setItem('eCommerceToken', res.token);
            } else {
              sessionStorage.setItem('eCommerceToken', res.token);
            }
            console.log('pew');

            //Login in flag
            this.authService.isLoggedInUser.set(true);

            //3.navigate to login page
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000)
            this.syncGuestCartToUser();
            this.syncGuestWishlistToUser();
            this.getUserID();

          }
        },

        error: (err) => {
          console.log('--- ENTERED ERROR BLOCK ---');
          //1. show Error message
          this.successMsg.set('');
          //2. hide success message
          const message = err.error?.message || 'Invalid email or password';
          this.errorMsg.set(message);

          console.error('Login Error:', err);
        }
      })
    }
  }


  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishlistService);

  syncGuestWishlistToUser() {
    console.log('sync wish');

    let guestWishlist: IProduct[] = [];

    try {
      guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    } catch {
      guestWishlist = [];
    }

    if (!guestWishlist.length) {
      this.getLoggedUsertWishlist();
      return
    };

    guestWishlist.forEach(product => {
      this.wishListService.addProductToWishlist(product.id).subscribe({
        next: (res) => { this.getLoggedUsertWishlist(); },
        error: (err) => console.log(err)
      });
    });


    localStorage.removeItem('guestWishlist');
    this.toastrService.info("Your wish list items have been saved!");
  }
  syncGuestCartToUser() {

    let guestCart: IGuestCartItem[] = [];

    try {
      guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    } catch {
      guestCart = [];
    }

    if (!guestCart.length) {
      this.getLoggedUserCart();
      return;
    }

    guestCart.forEach(item => {
      this.cartService.addProductToCart(item.product.id).subscribe({
        next: () => {
          if (item.count > 1) {
            this.cartService.updateCartProductQuantity(item.product.id, item.count).subscribe({
              error: (err) => console.log(err)
            });
          }
          this.getLoggedUserCart();
        },
        error: (err) => console.log(err)
      });
    });

    this.toastrService.info("Your cart items have been saved!");
    localStorage.removeItem('guestCart');
  }

  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.numberOfCartItems.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getLoggedUsertWishlist() {
    this.wishListService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishListService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  private readonly platformId = inject(PLATFORM_ID);
  getUserID() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('eCommerceToken') || sessionStorage.getItem('eCommerceToken');
      console.log('token ', token);
      if (token) {
        const decoded = jwtDecode<MyJwtPayload>(token); // Returns with the JwtPayload type
        this.authService.userId.set(decoded.id);
        this.authService.userName.set(decoded.name);
      }
    }
  }
  socialLogin(platform: string) {
    console.log('User clicked login with: ', platform);
    alert('جاري تسجيل الدخول بواسطة ' + platform);
  }


}

