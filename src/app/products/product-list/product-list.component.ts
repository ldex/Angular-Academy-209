import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product.interface';
import { ProductService } from '../../services/product.service';
import { Observable, EMPTY } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  title = 'Products';
 // products: Product[];
  products$: Observable<Product[]>;
  mostExpensiveProduct$: Observable<Product>;
  productsNumber$: Observable<number>;
  productsTotalNumber$: Observable<number>;
  selectedProduct: Product;
  errorMessage: string;
  

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;
  productsToLoad = this.pageSize * 2;
  
  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  loadMore() {
    let take: number = this.productsToLoad;
    let skip: number = this.end;

    this.productService.initProduct(skip, take);
  }

  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl('/products/' + product.id);
  }

  constructor(
    private productService: ProductService,
    private router: Router) { 
   
  }

  ngOnDestroy() {
    
  }

  ngOnInit(): void {

    this.productsTotalNumber$ = this.productService.productsTotalNumber$;
    this.mostExpensiveProduct$ = this.productService.mostExpensiveProduct$;

    this.products$ = this
                      .productService
                      .products$
                      .pipe(
                        catchError(
                          error => {
                            this.errorMessage = error;
                            return EMPTY;
                          }
                        )
                      );

    this.productsNumber$ = this
                              .products$
                              .pipe(
                                map(products => products.length),
                                startWith(0)
                              );

    // this
    //   .productService
    //   .products$
    //   .subscribe(
    //     results => this.products = results
    //   )
  }

}
