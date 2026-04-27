import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { IOrder } from '../../core/models/IOrder/iorder.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-single-order',
  imports: [DatePipe],
  templateUrl: './single-order.component.html',
  styleUrl: './single-order.component.css',
})
export class SingleOrderComponent {
  isShowDetails: WritableSignal<boolean> = signal(false);
  orderData: InputSignal<IOrder> = input.required<IOrder>();
}
