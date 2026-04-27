import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component"; // <-- import the module
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ICategory } from '../../core/models/ICategory/icategory.interface';
import { CategoryService } from '../../core/services/category/category.service';
@Component({
  selector: 'app-category-filter',
  imports: [NgxPaginationModule, ProductCardComponent, RouterLink],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.css',
})
export class CategoryFilterComponent {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  productList: WritableSignal<IProduct[]> = signal([]);
  private readonly wishlistService = inject(WishlistService);
  wishListDetails: WritableSignal<IProduct[]> = signal([]);



  private readonly activatedRoute = inject(ActivatedRoute);
  categoryId: WritableSignal<string> = signal('');
  getcategoryIdFromRoute() {
    this.activatedRoute.paramMap.subscribe((url) => {
      let id = url.get('id');
      if (id) {
        this.categoryId.set(id);
        this.getCurrentCategory(id);
        this.getAllProducts(1, id);
      }
    })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getcategoryIdFromRoute();
    if (this.authService.isLoggedInUser() === true) {
      this.getLoggedUserWishList();
    }
  }

  getLoggedUserWishList() {
    this.wishlistService.getLoggedUserWishlist().subscribe({

      next: (res) => {
        this.wishListDetails.set(res.data);
        console.log('wishlist', res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  pageSize: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  total: WritableSignal<number> = signal(0);
  getAllProducts(pageNumber: any = 1, categoryId?: string) {
    this.productsService.getAllProducts({ page: pageNumber, limit: 15, category: categoryId || this.categoryId() }).subscribe({
      next: (res) => {
        this.productList.set(res.data);
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

  currentCategory: WritableSignal<ICategory> = signal({} as ICategory);
  private readonly categoryService = inject(CategoryService);
  getCurrentCategory(categoryId?: string) {
    this.categoryService.getSpecificCategory(categoryId || this.categoryId()).subscribe({
      next: (res) => {

        this.currentCategory.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}


