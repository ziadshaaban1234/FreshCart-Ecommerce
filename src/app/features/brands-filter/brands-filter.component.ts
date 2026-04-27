import { BrandsService } from './../../core/services/brands/brands.service';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component"; // <-- import the module
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IBrand } from '../../core/models/IBrand/ibrand.interface';

@Component({
  selector: 'app-brands-filter',
  imports: [NgxPaginationModule, ProductCardComponent, RouterLink],// <-- include it in your app modules
  templateUrl: './brands-filter.component.html',
  styleUrl: './brands-filter.component.css',
})
export class BrandsFilterComponent {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  productList: WritableSignal<IProduct[]> = signal([]);
  private readonly wishlistService = inject(WishlistService);
  wishListDetails: WritableSignal<IProduct[]> = signal([]);



  private readonly activatedRoute = inject(ActivatedRoute);
  brandId: WritableSignal<string> = signal('');
  getBrandIdFromRoute() {
    this.activatedRoute.paramMap.subscribe((url) => {
      let id = url.get('id');
      if (id) {
        this.brandId.set(id);
        this.getCurrentBrand(id);
        this.getAllProducts();
      }
    })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getBrandIdFromRoute();
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
  getAllProducts(pageNumber: any = 1) {
    this.productsService.getAllProducts({ page: pageNumber, limit: 15, brand: this.brandId() }).subscribe({
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

  currentBrand: WritableSignal<IBrand> = signal({} as IBrand);
  private readonly brandService = inject(BrandsService);
  getCurrentBrand(id: string = this.brandId()) {
    this.brandService.getSpecificBrand(id).subscribe({
      next: (res) => {

        this.currentBrand.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}

