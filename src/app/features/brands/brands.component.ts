import { Component, signal, WritableSignal, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../core/models/IBrand/ibrand.interface';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module


@Component({
  selector: 'app-brands',
  imports: [RouterLink, NgxPaginationModule],// <-- include it in your app module
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  ngOnInit(): void {
    this.getAllBrands();
  }
  brandsList: WritableSignal<IBrand[]> = signal([])
  private readonly brandsService = inject(BrandsService);
  
  pageSize: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  total: WritableSignal<number> = signal(0);

  getAllBrands(pageNumber: any = 1) {
    this.brandsService.getAllBrands(pageNumber).subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
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
    this.getAllBrands(event);
  }
}
