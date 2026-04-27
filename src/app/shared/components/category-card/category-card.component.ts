import { Component, Input, input, InputSignal } from '@angular/core';

import { RouterLink } from "@angular/router";
import { ICategory } from '../../../core/models/ICategory/icategory.interface';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
  categoryData: InputSignal<ICategory> = input.required<ICategory>();
}
