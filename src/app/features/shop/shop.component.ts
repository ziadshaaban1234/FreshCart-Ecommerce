import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

@Component({
  selector: 'app-shop',
  imports: [RouterLink, ProductCardComponent, NgxPaginationModule],// <-- include it in your app module
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  productList: WritableSignal<IProduct[]> = signal([]);
  private readonly wishlistService = inject(WishlistService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  wishListDetails: WritableSignal<IProduct[]> = signal([]);

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        const searchTerm = params['q'] || '';
        this.getAllProducts(1, searchTerm);
      }
    });

    if (this.authService.isLoggedInUser()) {
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

  pageSize = signal(15);
  currentPage = signal(1);
  total = signal(0);
  getAllProducts(pageNumber: number = 1, keyword: string = '') {
    const queryParams: any = { page: pageNumber, limit: 15 };
    if (keyword.trim()) {
      queryParams.keyword = keyword;
    }

    this.productsService.getAllProducts(queryParams).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.total.set(res.results);
        this.currentPage.set(res.metadata.currentPage);
        this.pageSize.set(res.metadata.limit);
        console.log("Success! Products loaded:", res.data);
      },
      error: (err) => {
        console.error("Error loading products:", err);
      }
    });
  }

  pageChanged(event: number) {
    const currentTerm = this._activatedRoute.snapshot.queryParamMap.get('q') || '';
    this.getAllProducts(event, currentTerm);
    window.scrollTo(0, 0);
  }
}
