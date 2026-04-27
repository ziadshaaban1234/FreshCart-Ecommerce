import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../core/models/ICategory/icategory.interface';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, NgxPaginationModule],// <-- include it in your app module],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  categoriesList: WritableSignal<ICategory[]> = signal([]);


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProducts();
  }


  pageSize: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  total: WritableSignal<number> = signal(0);
  getAllProducts(pageNumber: any = 1) {
    this.categoryService.getAllCategories(pageNumber).subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
        console.log(res);
        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.total.set(res.results);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  pageChanged(event: number) {
    this.getAllProducts(event);
  }
}

