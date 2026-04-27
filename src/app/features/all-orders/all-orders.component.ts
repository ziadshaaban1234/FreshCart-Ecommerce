import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OrdersService } from '../../core/services/orders/orders.service';
import { jwtDecode } from "jwt-decode";
import { IOrder } from '../../core/models/IOrder/iorder.interface';
import { SingleOrderComponent } from '../../shared/single-order/single-order.component';
import { isPlatformBrowser } from '@angular/common';
import { MyJwtPayload } from '../../core/models/MyJwtPayload/my-jwt-payload.interface';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-all-orders',
  imports: [RouterLink, SingleOrderComponent],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css',
})
export class AllOrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  ordersList: WritableSignal<IOrder[]> = signal([]);
  userID: WritableSignal<string> = signal('');
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUserOrders();

  }
  getUserID() {
    if (!this.authService.userId()) {
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('eCommerceToken') || sessionStorage.getItem('eCommerceToken');
        if (token) {
          const decoded = jwtDecode<MyJwtPayload>(token); // Returns with the JwtPayload type
          this.userID.set(decoded.id)
          this.authService.userId.set(decoded.id);
        }
      }
    }
    else {
      this.userID.set(this.authService.userId());
    }
  }
  getUserOrders() {
    this.getUserID();
    this.ordersService.getUserOrders(this.userID()).subscribe({
      next: (res) => {
        console.log(res);
        this.ordersList.set(res as IOrder[]);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
